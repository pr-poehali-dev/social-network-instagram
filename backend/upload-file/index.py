"""
Загрузка файлов (фото, видео) в S3 хранилище.
Принимает base64-encoded файл, возвращает публичный CDN URL.
"""
import json
import os
import base64
import uuid
import boto3

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
    file_data = body.get("file")
    file_type = body.get("type", "image/jpeg")
    folder = body.get("folder", "posts")

    if not file_data:
        return {
            "statusCode": 400,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": "Файл не передан"}),
        }

    # Декодируем base64
    if "," in file_data:
        file_data = file_data.split(",", 1)[1]

    file_bytes = base64.b64decode(file_data)

    # Определяем расширение
    ext_map = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/gif": "gif",
        "image/webp": "webp",
        "video/mp4": "mp4",
        "video/quicktime": "mov",
        "video/webm": "webm",
    }
    ext = ext_map.get(file_type, "bin")

    file_name = f"{folder}/{uuid.uuid4()}.{ext}"

    s3 = boto3.client(
        "s3",
        endpoint_url="https://bucket.poehali.dev",
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    )

    s3.put_object(
        Bucket="files",
        Key=file_name,
        Body=file_bytes,
        ContentType=file_type,
    )

    cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{file_name}"

    return {
        "statusCode": 200,
        "headers": CORS_HEADERS,
        "body": json.dumps({"success": True, "url": cdn_url, "key": file_name}),
    }
