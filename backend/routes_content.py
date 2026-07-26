from pydantic import BaseModel
from typing import Optional
import uuid
from pathlib import Path
from datetime import datetime, timezone

import cloudinary
import cloudinary.uploader

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
)
from fastapi.responses import FileResponse

from database import read_collection, write_collection
from auth import get_current_user, require_admin

api = APIRouter(prefix="/api", tags=["content"])
class ServiceCreate(BaseModel):
    title: str
    description: str
    image: Optional[str] = ""
    slug: Optional[str] = ""

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
    payload: ServiceCreate,
    user=Depends(get_current_user),
):

    return create_collection_item(
        "services",
        payload.model_dump(),
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
    # ======================================================
# CASE STUDIES
# ======================================================

@api.get("/case-studies")
async def list_case_studies():
    return list_collection("case_studies")


@api.get("/case-studies/{item_id}")
async def get_case_study(item_id: str):

    item = get_by_id("case_studies", item_id)

    if not item:
        raise HTTPException(status_code=404, detail="Case study not found")

    return item


@api.post("/admin/case-studies")
async def create_case_study(
    payload: dict,
    user=Depends(get_current_user),
):

    return create_collection_item(
        "case_studies",
        payload,
    )


@api.put("/admin/case-studies/{item_id}")
async def update_case_study(
    item_id: str,
    payload: dict,
    user=Depends(get_current_user),
):

    return update_collection_item(
        "case_studies",
        item_id,
        payload,
    )


@api.delete("/admin/case-studies/{item_id}")
async def delete_case_study(
    item_id: str,
    user=Depends(get_current_user),
):

    return delete_collection_item(
        "case_studies",
        item_id,
    )
    # ======================================================
# POSTS
# ======================================================

@api.get("/posts")
async def list_posts():
    return list_collection("posts")


@api.get("/posts/{item_id}")
async def get_post(item_id: str):

    item = get_by_id("posts", item_id)

    if not item:
        raise HTTPException(status_code=404, detail="Post not found")

    return item


@api.post("/admin/posts")
async def create_post(
    payload: dict,
    user=Depends(get_current_user),
):

    return create_collection_item(
        "posts",
        payload,
    )


@api.put("/admin/posts/{item_id}")
async def update_post(
    item_id: str,
    payload: dict,
    user=Depends(get_current_user),
):

    return update_collection_item(
        "posts",
        item_id,
        payload,
    )


@api.delete("/admin/posts/{item_id}")
async def delete_post(
    item_id: str,
    user=Depends(get_current_user),
):

    return delete_collection_item(
        "posts",
        item_id,
    )
    # ======================================================
# TESTIMONIALS
# ======================================================

@api.get("/testimonials")
async def list_testimonials():
    return list_collection("testimonials")


@api.get("/testimonials/{item_id}")
async def get_testimonial(item_id: str):

    item = get_by_id("testimonials", item_id)

    if not item:
        raise HTTPException(status_code=404, detail="Testimonial not found")

    return item


@api.post("/admin/testimonials")
async def create_testimonial(
    payload: dict,
    user=Depends(get_current_user),
):

    return create_collection_item(
        "testimonials",
        payload,
    )


@api.put("/admin/testimonials/{item_id}")
async def update_testimonial(
    item_id: str,
    payload: dict,
    user=Depends(get_current_user),
):

    return update_collection_item(
        "testimonials",
        item_id,
        payload,
    )


@api.delete("/admin/testimonials/{item_id}")
async def delete_testimonial(
    item_id: str,
    user=Depends(get_current_user),
):

    return delete_collection_item(
        "testimonials",
        item_id,
    )
    # ======================================================
# FAQS
# ======================================================

@api.get("/faqs")
async def list_faqs():
    return list_collection("faqs")


@api.get("/faqs/{item_id}")
async def get_faq(item_id: str):

    item = get_by_id("faqs", item_id)

    if not item:
        raise HTTPException(status_code=404, detail="FAQ not found")

    return item


@api.post("/admin/faqs")
async def create_faq(
    payload: dict,
    user=Depends(get_current_user),
):

    return create_collection_item(
        "faqs",
        payload,
    )


@api.put("/admin/faqs/{item_id}")
async def update_faq(
    item_id: str,
    payload: dict,
    user=Depends(get_current_user),
):

    return update_collection_item(
        "faqs",
        item_id,
        payload,
    )


@api.delete("/admin/faqs/{item_id}")
async def delete_faq(
    item_id: str,
    user=Depends(get_current_user),
):

    return delete_collection_item(
        "faqs",
        item_id,
    )
    # ======================================================
# SEO
# ======================================================

@api.get("/seo")
async def list_seo():
    return list_collection("seo")


@api.get("/seo/{item_id}")
async def get_seo(item_id: str):

    item = get_by_id("seo", item_id)

    if not item:
        raise HTTPException(status_code=404, detail="SEO entry not found")

    return item


@api.post("/admin/seo")
async def create_seo(
    payload: dict,
    user=Depends(get_current_user),
):

    return create_collection_item(
        "seo",
        payload,
    )


@api.put("/admin/seo/{item_id}")
async def update_seo(
    item_id: str,
    payload: dict,
    user=Depends(get_current_user),
):

    return update_collection_item(
        "seo",
        item_id,
        payload,
    )


@api.delete("/admin/seo/{item_id}")
async def delete_seo(
    item_id: str,
    user=Depends(get_current_user),
):

    return delete_collection_item(
        "seo",
        item_id,
    )
    # ======================================================
# ENQUIRIES
# ======================================================

@api.get("/admin/enquiries")
async def list_enquiries(
    user=Depends(get_current_user),
):
    return list_collection("enquiries")


@api.post("/enquiries")
async def create_enquiry(payload: dict):

    payload["id"] = uid()
    payload["created_at"] = now()

    data = get_all("enquiries")
    data.append(payload)

    save_all("enquiries", data)

    return {
        "success": True,
        "message": "Enquiry submitted successfully."
    }


@api.delete("/admin/enquiries/{item_id}")
async def delete_enquiry(
    item_id: str,
    user=Depends(get_current_user),
):

    return delete_collection_item(
        "enquiries",
        item_id,
    )
    # ======================================================
# DASHBOARD
# ======================================================

@api.get("/admin/dashboard")
async def dashboard(
    user=Depends(get_current_user),
):

    return {
        "services": len(get_all("services")),
        "portfolio": len(get_all("portfolio")),
        "case_studies": len(get_all("case_studies")),
        "posts": len(get_all("posts")),
        "testimonials": len(get_all("testimonials")),
        "faqs": len(get_all("faqs")),
        "enquiries": len(get_all("enquiries")),
    }
    # ======================================================
# USERS
# ======================================================

@api.get("/admin/users")
async def list_users(
    user=Depends(require_admin),
):

    users = get_all("users")

    result = []

    for u in users:
        result.append(
            {
                "id": u.get("id"),
                "email": u.get("email"),
                "name": u.get("name", ""),
                "role": u.get("role", "editor"),
            }
        )

    return result


@api.post("/admin/users")
async def create_user(
    payload: dict,
    user=Depends(require_admin),
):

    users = get_all("users")

    payload["id"] = uid()
    payload["role"] = payload.get("role", "editor")
    payload["created_at"] = now()

    users.append(payload)

    save_all("users", users)

    return payload


@api.delete("/admin/users/{item_id}")
async def delete_user(
    item_id: str,
    user=Depends(require_admin),
):

    return delete_collection_item(
        "users",
        item_id,
    )
    # ======================================================
# MEDIA
# ======================================================

@api.post("/admin/media")
async def upload_media(
    file: UploadFile = File(...),
    user=Depends(get_current_user),
):

    file_id = uid()

    extension = file.filename.split(".")[-1]

    filename = f"{file_id}.{extension}"

    path = UPLOAD_DIR / filename

    content = await file.read()

    with open(path, "wb") as buffer:
        buffer.write(content)


    media = get_all("media")

    item = {
        "id": file_id,
        "filename": file.filename,
        "url": f"/api/media/{filename}",
        "created_at": now(),
    }

    media.append(item)

    save_all("media", media)

    return item



@api.get("/media/{filename}")
async def serve_media(filename: str):

    path = UPLOAD_DIR / filename

    if not path.exists():
        raise HTTPException(
            status_code=404,
            detail="File not found",
        )

    return FileResponse(path)



@api.get("/admin/media")
async def list_media(
    user=Depends(get_current_user),
):

    return get_all("media")



@api.delete("/admin/media/{item_id}")
async def delete_media(
    item_id: str,
    user=Depends(get_current_user),
):

    media = get_all("media")

    media = [
        x for x in media
        if x.get("id") != item_id
    ]

    save_all("media", media)

    return {
        "success": True
    }
