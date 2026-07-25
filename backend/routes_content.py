import uuid
from pathlib import Path
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException

from database import read_collection, write_collection
from auth import get_current_user, require_admin

api = APIRouter(prefix="/api", tags=["content"])

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


def now():
    return datetime.now(timezone.utc).isoformat()


def uid():
    return str(uuid.uuid4())


def slugify(text):
    return (text or "").lower().replace(" ", "-").replace("/", "-")


def get_all(name):
    return read_collection(name)


def save_all(name, data):
    write_collection(name, data)


def get_by_id(name, item_id):
    for item in get_all(name):
        if item.get("id") == item_id:
            return item
    return None


# ======================================================
# SETTINGS
# ======================================================

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
    # ======================================================
# PAGES
# ======================================================

@api.get("/pages/{page_id}")
async def get_page(page_id: str):

    pages = get_all("pages")

    for page in pages:
        if page.get("id") == page_id:
            return page

    raise HTTPException(status_code=404, detail="Page not found")


@api.put("/pages/{page_id}")
async def update_page(
    page_id: str,
    payload: dict,
    user=Depends(get_current_user),
):

    pages = get_all("pages")

    found = False

    for i, page in enumerate(pages):

        if page.get("id") == page_id:
            payload["id"] = page_id
            pages[i] = payload
            found = True
            break

    if not found:
        payload["id"] = page_id
        pages.append(payload)

    save_all("pages", pages)

    return payload


# ======================================================
# GENERIC CRUD HELPERS
# ======================================================

def list_collection(name):
    return get_all(name)


def create_collection_item(name, payload):

    payload["id"] = uid()

    if payload.get("title"):
        payload["slug"] = slugify(payload["title"])

    payload["created_at"] = now()

    data = get_all(name)
    data.append(payload)

    save_all(name, data)

    return payload


def update_collection_item(name, item_id, payload):

    data = get_all(name)

    for i, item in enumerate(data):

        if item.get("id") == item_id:

            payload["id"] = item_id

            if payload.get("title"):
                payload["slug"] = slugify(payload["title"])

            data[i] = payload

            save_all(name, data)

            return payload

    raise HTTPException(status_code=404, detail="Item not found")


def delete_collection_item(name, item_id):

    data = [
        item
        for item in get_all(name)
        if item.get("id") != item_id
    ]

    save_all(name, data)

    return {"success": True}
    # ======================================================
# SERVICES
# ======================================================

@api.get("/services")
async def list_services():

    return list_collection("services")


@api.get("/services/{item_id}")
async def get_service(item_id: str):

    item = get_by_id("services", item_id)

    if not item:
        raise HTTPException(status_code=404, detail="Service not found")

    return item


@api.post("/admin/services")
async def create_service(
    payload: dict,
    user=Depends(get_current_user),
):

    return create_collection_item(
        "services",
        payload,
    )


@api.put("/admin/services/{item_id}")
async def update_service(
    item_id: str,
    payload: dict,
    user=Depends(get_current_user),
):

    return update_collection_item(
        "services",
        item_id,
        payload,
    )


@api.delete("/admin/services/{item_id}")
async def delete_service(
    item_id: str,
    user=Depends(get_current_user),
):

    return delete_collection_item(
        "services",
        item_id,
    )
    # ======================================================
# PORTFOLIO
# ======================================================

@api.get("/portfolio")
async def list_portfolio():
    return list_collection("portfolio")


@api.get("/portfolio/{item_id}")
async def get_portfolio(item_id: str):

    item = get_by_id("portfolio", item_id)

    if not item:
        raise HTTPException(status_code=404, detail="Portfolio item not found")

    return item


@api.post("/admin/portfolio")
async def create_portfolio(
    payload: dict,
    user=Depends(get_current_user),
):
    return create_collection_item(
        "portfolio",
        payload,
    )


@api.put("/admin/portfolio/{item_id}")
async def update_portfolio(
    item_id: str,
    payload: dict,
    user=Depends(get_current_user),
):
    return update_collection_item(
        "portfolio",
        item_id,
        payload,
    )


@api.delete("/admin/portfolio/{item_id}")
async def delete_portfolio(
    item_id: str,
    user=Depends(get_current_user),
):
    return delete_collection_item(
        "portfolio",
        item_id,
    )
