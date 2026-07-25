import os
import secrets
import logging
from datetime import datetime, timezone, timedelta

import jwt
import bcrypt
from bson import ObjectId
from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel, EmailStr

from database import db

logger = logging.getLogger(__name__)

JWT_ALGORITHM = "HS256"
ACCESS_TTL_MIN = 60 * 12  # 12h access token for a CMS
MAX_ATTEMPTS = 5
LOCKOUT_MIN = 15

auth_router = APIRouter(prefix="/api/auth", tags=["auth"])


# ---------- password + token helpers ----------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


def create_access_token(user_id: str, email: str, role: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TTL_MIN),
        "type": "access",
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


def public_user(user: dict) -> dict:
    return {
        "id": user["id"],
        "email": user["email"],
        "name": user.get("name", ""),
        "role": user.get("role", "editor"),
    }


# ---------- dependency ----------
async def get_current_user(request: Request) -> dict:
    token = None
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header[7:]
    if not token:
        token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


# ---------- schemas ----------
class LoginBody(BaseModel):
    email: EmailStr
    password: str


class ForgotBody(BaseModel):
    email: EmailStr


class ResetBody(BaseModel):
    token: str
    new_password: str


class ChangePwBody(BaseModel):
    current_password: str
    new_password: str


# ---------- endpoints ----------
def get_client_ip(request: Request) -> str:
    xff = request.headers.get("x-forwarded-for")
    if xff:
        return xff.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


@auth_router.post("/login")
async def login(body: LoginBody, request: Request):
    email = body.email.lower().strip()
    # Lock by account (email) — reliable behind reverse proxy / k8s ingress
    identifier = f"account:{email}"

    attempt = await db.login_attempts.find_one({"identifier": identifier})
    if attempt and attempt.get("count", 0) >= MAX_ATTEMPTS:
        locked_until = attempt.get("locked_until")
        if locked_until and datetime.now(timezone.utc) < datetime.fromisoformat(locked_until):
            raise HTTPException(status_code=429, detail="Too many attempts. Try again later.")

    user = await db.users.find_one({"email": email}, {"_id": 0})
    if not user or not verify_password(body.password, user["password_hash"]):
        new_count = (attempt.get("count", 0) if attempt else 0) + 1
        update = {"count": new_count}
        if new_count >= MAX_ATTEMPTS:
            update["locked_until"] = (datetime.now(timezone.utc) + timedelta(minutes=LOCKOUT_MIN)).isoformat()
        await db.login_attempts.update_one({"identifier": identifier}, {"$set": update}, upsert=True)
        raise HTTPException(status_code=401, detail="Invalid email or password")

    await db.login_attempts.delete_one({"identifier": identifier})
    token = create_access_token(user["id"], user["email"], user.get("role", "editor"))
    return {"token": token, "user": public_user(user)}


@auth_router.get("/me")
async def me(user: dict = Depends(get_current_user)):
    return public_user(user)


@auth_router.post("/logout")
async def logout(user: dict = Depends(get_current_user)):
    return {"success": True}


@auth_router.post("/forgot-password")
async def forgot_password(body: ForgotBody):
    email = body.email.lower().strip()
    user = await db.users.find_one({"email": email}, {"_id": 0})
    # Always respond success to avoid user enumeration
    if user:
        token = secrets.token_urlsafe(32)
        await db.password_reset_tokens.insert_one({
            "token": token,
            "user_id": user["id"],
            "used": False,
            "expires_at": datetime.now(timezone.utc) + timedelta(hours=1),
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        reset_link = f"{os.environ.get('FRONTEND_URL','')}/admin/reset-password?token={token}"
        logger.info(f"[PASSWORD RESET] link for {email}: {reset_link}")
    return {"success": True, "message": "If that account exists, a reset link has been sent."}


@auth_router.post("/reset-password")
async def reset_password(body: ResetBody):
    rec = await db.password_reset_tokens.find_one({"token": body.token})
    if not rec or rec.get("used"):
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    if len(body.new_password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
    await db.users.update_one({"id": rec["user_id"]}, {"$set": {"password_hash": hash_password(body.new_password)}})
    await db.password_reset_tokens.update_one({"token": body.token}, {"$set": {"used": True}})
    return {"success": True}


@auth_router.post("/change-password")
async def change_password(body: ChangePwBody, user: dict = Depends(get_current_user)):
    full = await db.users.find_one({"id": user["id"]}, {"_id": 0})
    if not verify_password(body.current_password, full["password_hash"]):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    if len(body.new_password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
    await db.users.update_one({"id": user["id"]}, {"$set": {"password_hash": hash_password(body.new_password)}})
    return {"success": True}


async def seed_admin():
    import uuid
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@apexora.studio").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "Apexora@2025")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Studio Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info(f"Seeded admin user {admin_email}")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})
