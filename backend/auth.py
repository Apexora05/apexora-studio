import os
import uuid
import bcrypt
import jwt

from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr

from database import db, read_collection, write_collection

JWT_SECRET = os.environ.get("JWT_SECRET", "apexora-secret")
JWT_ALGORITHM = "HS256"
security = HTTPBearer()
def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]

auth_router = APIRouter(prefix="/api/auth", tags=["auth"])


def hash_password(password: str):
    return bcrypt.hashpw(
        password.encode(),
        bcrypt.gensalt()
    ).decode()


def verify_password(password, hashed):
    return bcrypt.checkpw(
        password.encode(),
        hashed.encode()
    )


def create_token(user):
    return jwt.encode(
        {
            "sub": user["id"],
            "email": user["email"],
            "role": user["role"],
            "exp": datetime.now(timezone.utc) + timedelta(hours=12),
            "type": "access",
        },
        JWT_SECRET,
        algorithm=JWT_ALGORITHM,
    )


def public_user(user):
    return {
        "id": user["id"],
        "email": user["email"],
        "name": user.get("name", ""),
        "role": user.get("role", "editor"),
    }


class LoginBody(BaseModel):
    email: EmailStr
    password: str


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer())
) -> dict:
    
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            get_jwt_secret(),
            algorithms=[JWT_ALGORITHM]
        )

        if payload.get("type") != "access":
            raise HTTPException(
                status_code=401,
                detail="Invalid token type"
            )

       users = read_collection("users")

user = None

for u in users:
    if u["id"] == payload["sub"]:
        user = u
        break

        if not user:
            raise HTTPException(
                status_code=401,
                detail="User not found"
            )

        user.pop("password_hash", None)

        return user

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Session expired"
        )

    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    auth = request.headers.get("Authorization", "")

    if not auth.startswith("Bearer "):
        raise HTTPException(401, "Not authenticated")

    token = auth[7:]

    try:
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM],
        )

    except Exception:
        raise HTTPException(401, "Invalid token")

    users = read_collection("users")

    for user in users:
        if user["id"] == payload["sub"]:
            return user

    raise HTTPException(401, "User not found")


async def require_admin(user=Depends(get_current_user)):

    if user["role"] != "admin":
        raise HTTPException(403, "Admin only")

    return user


@auth_router.post("/login")
async def login(body: LoginBody):

    users = read_collection("users")

    for user in users:

        if (
            user["email"].lower() == body.email.lower()
            and verify_password(body.password, user["password_hash"])
        ):
            return {
                "token": create_token(user),
                "user": public_user(user),
            }

    raise HTTPException(401, "Invalid email or password")


@auth_router.get("/me")
async def me(user=Depends(get_current_user)):
    return public_user(user)


@auth_router.post("/logout")
async def logout():
    return {"success": True}


async def seed_admin():

    users = read_collection("users")

    if users:
        return

    users.append(
        {
            "id": str(uuid.uuid4()),
            "email": os.environ.get(
                "ADMIN_EMAIL",
                "admin@apexora.studio",
            ),
            "password_hash": hash_password(
                os.environ.get(
                    "ADMIN_PASSWORD",
                    "Apexora@2025",
                )
            ),
            "name": "Admin",
            "role": "admin",
        }
    )

    write_collection("users", users)
