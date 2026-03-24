"""
Проверка SMS-кода и авторизация/регистрация пользователя.
Возвращает данные пользователя при успехе.
"""
import json
import os
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
    code = body.get("code", "").strip()

    if not phone or not code:
        return {
            "statusCode": 400,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": "Укажите номер и код"}),
        }

    # Нормализуем номер
    digits = "".join(c for c in phone if c.isdigit())
    if digits.startswith("8") and len(digits) == 11:
        digits = "7" + digits[1:]
    if not digits.startswith("7"):
        digits = "7" + digits[-10:]
    normalized_phone = "+" + digits

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    # Проверяем код
    cur.execute(
        f"""SELECT id FROM {SCHEMA}.sms_codes
            WHERE phone = %s AND code = %s AND used = FALSE AND expires_at > NOW()
            ORDER BY created_at DESC LIMIT 1""",
        (normalized_phone, code)
    )
    row = cur.fetchone()

    if not row:
        cur.close()
        conn.close()
        return {
            "statusCode": 401,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": "Неверный или истёкший код"}),
        }

    # Помечаем код как использованный
    cur.execute(
        f"UPDATE {SCHEMA}.sms_codes SET used = TRUE WHERE id = %s",
        (row[0],)
    )

    # Ищем пользователя
    cur.execute(
        f"SELECT id, username, name, bio, avatar_url FROM {SCHEMA}.users WHERE phone = %s",
        (normalized_phone,)
    )
    user_row = cur.fetchone()

    conn.commit()
    cur.close()
    conn.close()

    if user_row:
        # Пользователь уже есть
        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps({
                "success": True,
                "is_new": False,
                "user": {
                    "id": user_row[0],
                    "phone": normalized_phone,
                    "username": user_row[1],
                    "name": user_row[2],
                    "bio": user_row[3] or "",
                    "avatar_url": user_row[4] or "",
                },
            }),
        }
    else:
        # Новый пользователь — нужно заполнить профиль
        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps({
                "success": True,
                "is_new": True,
                "phone": normalized_phone,
            }),
        }
