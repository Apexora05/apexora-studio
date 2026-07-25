import os
import jwt

from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from database import read_collection


JWT_SECRET = os.environ.get("JWT_SECRET", "apexora-secret")
JWT_ALGORITHM = "HS256"

security = HTTPBearer()


def get_jwt_secret() -> str:
    return JWT_SECRET


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
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
