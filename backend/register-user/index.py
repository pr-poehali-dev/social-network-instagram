"""
Создание нового пользователя после подтверждения телефона.
Сохраняет имя, никнейм и возвращает данные пользователя.
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
    name = body.get("name", "").strip()
    username = body.get("username", "").strip().lower()

    if not phone or not name or not username:
        return {
            "statusCode": 400,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": "Заполните все поля"}),
        }

    if len(username) < 3:
        return {
            "statusCode": 400,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": "Никнейм минимум 3 символа"}),
        }

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    # Проверяем уникальность никнейма
    cur.execute(
        f"SELECT id FROM {SCHEMA}.users WHERE username = %s",
        (username,)
    )
    if cur.fetchone():
        cur.close()
        conn.close()
        return {
            "statusCode": 409,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": "Этот никнейм уже занят"}),
        }

    # Создаём пользователя
    cur.execute(
        f"""INSERT INTO {SCHEMA}.users (phone, username, name)
            VALUES (%s, %s, %s)
            ON CONFLICT (phone) DO UPDATE SET username = EXCLUDED.username, name = EXCLUDED.name
            RETURNING id, username, name""",
        (phone, username, name)
    )
    user = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    return {
        "statusCode": 200,
        "headers": CORS_HEADERS,
        "body": json.dumps({
            "success": True,
            "user": {
                "id": user[0],
                "phone": phone,
                "username": user[1],
                "name": user[2],
            },
        }),
    }
