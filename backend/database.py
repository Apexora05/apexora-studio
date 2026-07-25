import json
import os
from pathlib import Path

DATA_DIR = Path("data")
DATA_DIR.mkdir(exist_ok=True)


def get_collection(name):
    file_path = DATA_DIR / f"{name}.json"

    if not file_path.exists():
        file_path.write_text("[]", encoding="utf-8")

    return file_path


def read_collection(name):
    file_path = get_collection(name)

    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)


def write_collection(name, data):
    file_path = get_collection(name)

    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)


async def create_indexes():
    return
