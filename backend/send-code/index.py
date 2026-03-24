"""
Отправка SMS-кода подтверждения на номер телефона.
Генерирует 6-значный код и отправляет через sms.ru.
"""
import json
import os
import random
import string
import urllib.request
import urllib.parse
import psycopg2


SCHEMA = "t_p80023021_social_network_insta"

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
}


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    body = json.loads(event.get("body") or "{}")
    phone = body.get("phone", "").strip()

    if not phone:
        return {
            "statusCode": 400,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": "Укажите номер телефона"}),
        }

    # Нормализуем номер: оставляем только цифры, добавляем 7 если надо
    digits = "".join(c for c in phone if c.isdigit())
    if digits.startswith("8") and len(digits) == 11:
        digits = "7" + digits[1:]
    if not digits.startswith("7"):
        digits = "7" + digits[-10:]
    normalized_phone = "+" + digits

    # Генерируем 6-значный код
    code = "".join(random.choices(string.digits, k=6))

    # Сохраняем код в БД
    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    # Инвалидируем старые коды для этого номера
    cur.execute(
        f"UPDATE {SCHEMA}.sms_codes SET used = TRUE WHERE phone = %s AND used = FALSE",
        (normalized_phone,)
    )

    cur.execute(
        f"""INSERT INTO {SCHEMA}.sms_codes (phone, code, expires_at)
            VALUES (%s, %s, NOW() + INTERVAL '10 minutes')""",
        (normalized_phone, code)
    )
    conn.commit()
    cur.close()
    conn.close()

    # Отправляем SMS через sms.ru
    api_key = os.environ.get("SMS_RU_API_KEY", "")
    sms_sent = False
    sms_error = None

    if api_key:
        try:
            params = urllib.parse.urlencode({
                "api_id": api_key,
                "to": normalized_phone,
                "msg": f"Ваш код VIBE: {code}",
                "json": 1,
            })
            url = f"https://sms.ru/sms/send?{params}"
            req = urllib.request.urlopen(url, timeout=10)
            resp = json.loads(req.read().decode())
            sms_sent = resp.get("status") == "OK"
            if not sms_sent:
                sms_error = resp.get("status_text", "Ошибка отправки")
        except Exception as e:
            sms_error = str(e)
    else:
        # В режиме разработки — возвращаем код в ответе
        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps({
                "success": True,
                "dev_code": code,
                "message": "SMS_RU_API_KEY не задан — код возвращён для разработки",
            }),
        }

    if not sms_sent:
        return {
            "statusCode": 500,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": sms_error or "Не удалось отправить SMS"}),
        }

    return {
        "statusCode": 200,
        "headers": CORS_HEADERS,
        "body": json.dumps({"success": True, "message": "Код отправлен"}),
    }
