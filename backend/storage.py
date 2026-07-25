import os
from pathlib import Path

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


def init_storage():
    return True


def put_object(path: str, data: bytes, content_type: str):
    file_path = UPLOAD_DIR / path
    file_path.parent.mkdir(parents=True, exist_ok=True)

    with open(file_path, "wb") as f:
        f.write(data)

    return {
        "success": True,
        "path": str(file_path)
    }


def get_object(path: str):
    file_path = UPLOAD_DIR / path

    with open(file_path, "rb") as f:
        data = f.read()

    return data, "application/octet-stream"


def guess_content_type(filename: str):
    return "application/octet-stream"
