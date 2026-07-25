import os
import csv
import io
import uuid
import re
import logging
from datetime import datetime, timezone, timedelta

from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form, Request, Query
from fastapi.responses import Response, StreamingResponse
from pydantic import BaseModel, EmailStr, field_validator

from database import db
from auth import get_current_user, require_admin, hash_password, public_user
from storage import put_object, get_object, guess_content_type, APP_NAME
from emailer import send_enquiry_notification

logger = logging.getLogger(__name__)
api = APIRouter(prefix="/api", tags=["content"])


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def slugify(text: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", (text or "").lower()).strip("-")
    return s or str(uuid.uuid4())[:8]


def clean(doc):
    if doc:
        doc.pop("_id", None)
    return doc


# ============================================================
# SETTINGS (public read / admin write)
# ============================================================
@api.get("/settings")
async def get_settings():
    return clean(await db.settings.find_one({"id": "site"})) or {}


@api.put("/settings")
async def update_settings(payload: dict, user: dict = Depends(require_admin)):
    payload.pop("_id", None)
    payload["id"] = "site"
    payload["updated_at"] = now_iso()
    await db.settings.update_one({"id": "site"}, {"$set": payload}, upsert=True)
    return clean(await db.settings.find_one({"id": "site"}))


# ============================================================
# PAGES (home / about) — flexible JSON documents
# ============================================================
@api.get("/pages/{page_id}")
async def get_page(page_id: str):
    doc = clean(await db.pages.find_one({"id": page_id}))
    if not doc:
        raise HTTPException(status_code=404, detail="Page not found")
    return doc


@api.put("/pages/{page_id}")
async def update_page(page_id: str, payload: dict, user: dict = Depends(get_current_user)):
    payload.pop("_id", None)
    payload["id"] = page_id
    payload["updated_at"] = now_iso()
    await db.pages.update_one({"id": page_id}, {"$set": payload}, upsert=True)
    return clean(await db.pages.find_one({"id": page_id}))


# ============================================================
# Generic collection CRUD factory
# ============================================================
def register_collection(coll_name: str, singular: str, slug_field: bool = True):
    plural_path = coll_name.replace("_", "-")

    @api.get(f"/{plural_path}", name=f"list_{coll_name}")
    async def list_items(request: Request):
        params = dict(request.query_params)
        q = {}
        # public visibility filters
        if coll_name == "posts" and params.get("admin") != "1":
            q["status"] = "published"
        if params.get("featured") == "1":
            q["featured"] = True
        if params.get("category"):
            q["category"] = params["category"]
        docs = await db[coll_name].find(q).to_list(1000)
        docs = [clean(d) for d in docs]
        # search for posts
        search = params.get("search")
        if search and coll_name == "posts":
            s = search.lower()
            docs = [d for d in docs if s in d.get("title", "").lower() or s in d.get("excerpt", "").lower()]
        docs.sort(key=lambda d: (d.get("order", 999), d.get("created_at", "")))
        if coll_name == "posts":
            docs.sort(key=lambda d: d.get("published_at") or d.get("created_at", ""), reverse=True)
        return docs

    if slug_field:
        @api.get(f"/{plural_path}/{{slug}}", name=f"get_{coll_name}")
        async def get_item(slug: str):
            doc = clean(await db[coll_name].find_one({"slug": slug})) or clean(await db[coll_name].find_one({"id": slug}))
            if not doc:
                raise HTTPException(status_code=404, detail=f"{singular} not found")
            return doc

    @api.post(f"/admin/{plural_path}", name=f"create_{coll_name}")
    async def create_item(payload: dict, user: dict = Depends(get_current_user)):
        payload.pop("_id", None)
        payload["id"] = str(uuid.uuid4())
        if slug_field:
            base = payload.get("slug") or slugify(payload.get("title", ""))
            slug = base
            i = 2
            while await db[coll_name].find_one({"slug": slug}):
                slug = f"{base}-{i}"; i += 1
            payload["slug"] = slug
        payload["created_at"] = now_iso()
        payload["updated_at"] = now_iso()
        await db[coll_name].insert_one(payload)
        return clean(await db[coll_name].find_one({"id": payload["id"]}))

    @api.put(f"/admin/{plural_path}/{{item_id}}", name=f"update_{coll_name}")
    async def update_item(item_id: str, payload: dict, user: dict = Depends(get_current_user)):
        payload.pop("_id", None)
        payload.pop("id", None)
        payload["updated_at"] = now_iso()
        res = await db[coll_name].update_one({"id": item_id}, {"$set": payload})
        if res.matched_count == 0:
            raise HTTPException(status_code=404, detail=f"{singular} not found")
        return clean(await db[coll_name].find_one({"id": item_id}))

    @api.delete(f"/admin/{plural_path}/{{item_id}}", name=f"delete_{coll_name}")
    async def delete_item(item_id: str, user: dict = Depends(get_current_user)):
        await db[coll_name].delete_one({"id": item_id})
        return {"success": True}


register_collection("services", "Service")
register_collection("portfolio", "Project")
register_collection("case_studies", "Case study")
register_collection("posts", "Post")
register_collection("testimonials", "Testimonial", slug_field=False)
register_collection("faqs", "FAQ", slug_field=False)


# ============================================================
# SEO manager
# ============================================================
@api.get("/seo")
async def list_seo():
    docs = [clean(d) for d in await db.seo.find().to_list(1000)]
    return docs


@api.get("/seo-by-path")
async def get_seo(path: str = Query(...)):
    return clean(await db.seo.find_one({"path": path})) or {}


@api.put("/admin/seo")
async def upsert_seo(payload: dict, user: dict = Depends(get_current_user)):
    payload.pop("_id", None)
    path = payload.get("path")
    if not path:
        raise HTTPException(status_code=400, detail="path is required")
    payload["updated_at"] = now_iso()
    if not payload.get("id"):
        payload["id"] = str(uuid.uuid4())
    await db.seo.update_one({"path": path}, {"$set": payload}, upsert=True)
    return clean(await db.seo.find_one({"path": path}))


# ============================================================
# ENQUIRIES (public submit with rate limiting + admin manage)
# ============================================================
class EnquiryBody(BaseModel):
    name: str
    email: EmailStr
    company: str = ""
    website: str = ""
    phone: str = ""
    budget: str = ""
    message: str
    honeypot: str = ""  # spam trap

    @field_validator("name", "message")
    @classmethod
    def not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("This field is required")
        return v.strip()


@api.post("/enquiries")
async def create_enquiry(body: EnquiryBody, request: Request):
    # Honeypot spam trap
    if body.honeypot:
        return {"success": True}
    ip = request.client.host if request.client else "unknown"
    # Rate limit: max 5 submissions per IP per hour
    since = (datetime.now(timezone.utc) - timedelta(hours=1)).isoformat()
    recent = await db.enquiries.count_documents({"ip": ip, "created_at": {"$gte": since}})
    if recent >= 5:
        raise HTTPException(status_code=429, detail="Too many submissions. Please try again later.")

    doc = {
        "id": str(uuid.uuid4()),
        "name": body.name, "email": body.email, "company": body.company,
        "website": body.website, "phone": body.phone, "budget": body.budget,
        "message": body.message, "read": False, "ip": ip, "created_at": now_iso(),
    }
    await db.enquiries.insert_one(doc)
    await send_enquiry_notification(doc)
    return {"success": True, "message": "Thanks — we'll be in touch within one business day."}


@api.get("/admin/enquiries")
async def list_enquiries(user: dict = Depends(get_current_user)):
    docs = [clean(d) for d in await db.enquiries.find().sort("created_at", -1).to_list(1000)]
    return docs


@api.patch("/admin/enquiries/{item_id}")
async def update_enquiry(item_id: str, payload: dict, user: dict = Depends(get_current_user)):
    payload.pop("_id", None); payload.pop("id", None)
    await db.enquiries.update_one({"id": item_id}, {"$set": payload})
    return clean(await db.enquiries.find_one({"id": item_id}))


@api.delete("/admin/enquiries/{item_id}")
async def delete_enquiry(item_id: str, user: dict = Depends(get_current_user)):
    await db.enquiries.delete_one({"id": item_id})
    return {"success": True}


@api.get("/admin/enquiries-export")
async def export_enquiries(user: dict = Depends(get_current_user)):
    docs = await db.enquiries.find().sort("created_at", -1).to_list(5000)
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Name", "Email", "Company", "Website", "Phone", "Budget", "Message", "Read", "Date"])
    for d in docs:
        writer.writerow([d.get("name"), d.get("email"), d.get("company"), d.get("website"),
                         d.get("phone"), d.get("budget"), d.get("message"), d.get("read"), d.get("created_at")])
    output.seek(0)
    return StreamingResponse(iter([output.getvalue()]), media_type="text/csv",
                             headers={"Content-Disposition": "attachment; filename=enquiries.csv"})


# ============================================================
# MEDIA LIBRARY (Emergent object storage)
# ============================================================
@api.post("/admin/media")
async def upload_media(
    file: UploadFile = File(...),
    folder: str = Form("general"),
    alt: str = Form(""),
    user: dict = Depends(get_current_user),
):
    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else "bin"
    media_id = str(uuid.uuid4())
    folder = slugify(folder) or "general"
    path = f"{APP_NAME}/media/{folder}/{media_id}.{ext}"
    data = await file.read()
    content_type = file.content_type or guess_content_type(file.filename)
    result = put_object(path, data, content_type)
    doc = {
        "id": media_id,
        "storage_path": result["path"],
        "filename": file.filename,
        "folder": folder,
        "alt": alt,
        "content_type": content_type,
        "size": result.get("size", len(data)),
        "url": f"/api/media/{media_id}/raw",
        "created_at": now_iso(),
    }
    await db.media.insert_one(doc)
    return clean(await db.media.find_one({"id": media_id}))


@api.get("/admin/media")
async def list_media(user: dict = Depends(get_current_user), folder: str = Query(None), search: str = Query(None)):
    q = {}
    if folder and folder != "all":
        q["folder"] = folder
    docs = [clean(d) for d in await db.media.find(q).sort("created_at", -1).to_list(1000)]
    if search:
        s = search.lower()
        docs = [d for d in docs if s in d.get("filename", "").lower() or s in d.get("alt", "").lower()]
    return docs


@api.get("/admin/media-folders")
async def media_folders(user: dict = Depends(get_current_user)):
    folders = await db.media.distinct("folder")
    return sorted([f for f in folders if f])


@api.put("/admin/media/{media_id}")
async def update_media_meta(media_id: str, payload: dict, user: dict = Depends(get_current_user)):
    payload.pop("_id", None); payload.pop("id", None); payload.pop("url", None); payload.pop("storage_path", None)
    await db.media.update_one({"id": media_id}, {"$set": payload})
    return clean(await db.media.find_one({"id": media_id}))


@api.post("/admin/media/{media_id}/replace")
async def replace_media(media_id: str, file: UploadFile = File(...), user: dict = Depends(get_current_user)):
    record = await db.media.find_one({"id": media_id})
    if not record:
        raise HTTPException(status_code=404, detail="Media not found")
    data = await file.read()
    content_type = file.content_type or guess_content_type(file.filename)
    # keep same storage_path so URL is unchanged
    put_object(record["storage_path"], data, content_type)
    await db.media.update_one({"id": media_id}, {"$set": {"content_type": content_type, "size": len(data), "filename": file.filename, "updated_at": now_iso()}})
    return clean(await db.media.find_one({"id": media_id}))


@api.delete("/admin/media/{media_id}")
async def delete_media(media_id: str, user: dict = Depends(get_current_user)):
    await db.media.delete_one({"id": media_id})
    return {"success": True}


@api.get("/media/{media_id}/raw")
async def serve_media(media_id: str):
    record = await db.media.find_one({"id": media_id})
    if not record:
        raise HTTPException(status_code=404, detail="Media not found")
    data, content_type = get_object(record["storage_path"])
    return Response(content=data, media_type=record.get("content_type", content_type),
                    headers={"Cache-Control": "public, max-age=31536000, immutable"})


# ============================================================
# USER MANAGEMENT (admin only)
# ============================================================
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str = ""
    role: str = "editor"


@api.get("/admin/users")
async def list_users(user: dict = Depends(require_admin)):
    docs = await db.users.find({}, {"_id": 0, "password_hash": 0}).to_list(1000)
    return docs


@api.post("/admin/users")
async def create_user(body: UserCreate, user: dict = Depends(require_admin)):
    email = body.email.lower().strip()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="A user with that email already exists")
    if len(body.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
    doc = {
        "id": str(uuid.uuid4()), "email": email, "name": body.name,
        "role": body.role if body.role in ("admin", "editor") else "editor",
        "password_hash": hash_password(body.password), "created_at": now_iso(),
    }
    await db.users.insert_one(doc)
    return public_user(doc)


@api.put("/admin/users/{user_id}")
async def update_user(user_id: str, payload: dict, admin: dict = Depends(require_admin)):
    payload.pop("_id", None); payload.pop("id", None)
    if payload.get("password"):
        if len(payload["password"]) < 8:
            raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
        payload["password_hash"] = hash_password(payload.pop("password"))
    else:
        payload.pop("password", None)
    if "role" in payload and payload["role"] not in ("admin", "editor"):
        payload["role"] = "editor"
    await db.users.update_one({"id": user_id}, {"$set": payload})
    u = await db.users.find_one({"id": user_id}, {"_id": 0, "password_hash": 0})
    return u


@api.delete("/admin/users/{user_id}")
async def delete_user(user_id: str, admin: dict = Depends(require_admin)):
    if user_id == admin["id"]:
        raise HTTPException(status_code=400, detail="You cannot delete your own account")
    await db.users.delete_one({"id": user_id})
    return {"success": True}


# ============================================================
# DASHBOARD STATS
# ============================================================
@api.get("/admin/stats")
async def stats(user: dict = Depends(get_current_user)):
    return {
        "portfolio": await db.portfolio.count_documents({}),
        "case_studies": await db.case_studies.count_documents({}),
        "posts": await db.posts.count_documents({}),
        "posts_published": await db.posts.count_documents({"status": "published"}),
        "services": await db.services.count_documents({}),
        "testimonials": await db.testimonials.count_documents({}),
        "faqs": await db.faqs.count_documents({}),
        "media": await db.media.count_documents({}),
        "enquiries": await db.enquiries.count_documents({}),
        "enquiries_unread": await db.enquiries.count_documents({"read": False}),
        "users": await db.users.count_documents({}),
    }
