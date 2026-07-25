import uuid
import os
import shutil
from pathlib import Path
from datetime import datetime, timezone

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    Form,
)

from fastapi.responses import FileResponse

from database import (
    db,
    read_collection,
    write_collection,
)

from auth import (
    get_current_user,
    require_admin,
)

api = APIRouter(prefix="/api", tags=["content"])


UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


def now():
    return datetime.now(timezone.utc).isoformat()


def uid():
    return str(uuid.uuid4())


def slugify(text):

    return (
        text.lower()
        .replace(" ", "-")
        .replace("/", "-")
    )


def get_all(name):

    return read_collection(name)


def save_all(name, data):

    write_collection(name, data)


def get_by_id(name, item_id):

    for item in get_all(name):

        if item["id"] == item_id:
            return item

    return None
    @api.get("/settings")
async def get_settings():

    data = get_all("settings")

    if data:
        return data[0]

    return {}


@api.put("/settings")
async def update_settings(
    payload: dict,
    user=Depends(require_admin),
):

    payload["id"] = "site"

    save_all(
        "settings",
        [payload],
    )

    return payload
