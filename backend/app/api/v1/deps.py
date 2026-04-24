import time
from datetime import datetime
from typing import Optional

import httpx
from bson import ObjectId
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from app.core.config import settings
from app.core.database import get_database

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login",
    auto_error=False,
)

# ---------------------------------------------------------------------------
# JWKS cache — refresh every hour to avoid fetching on every request
# ---------------------------------------------------------------------------
_jwks_cache: Optional[dict] = None
_jwks_cache_time: float = 0.0
_JWKS_TTL = 3600  # seconds


async def _get_jwks() -> dict:
    global _jwks_cache, _jwks_cache_time

    now = time.monotonic()
    if _jwks_cache and (now - _jwks_cache_time) < _JWKS_TTL:
        return _jwks_cache

    if not settings.CLERK_JWKS_URL:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="CLERK_JWKS_URL is not configured on the server.",
        )

    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.get(settings.CLERK_JWKS_URL)
        response.raise_for_status()
        _jwks_cache = response.json()
        _jwks_cache_time = now
        return _jwks_cache


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def fix_id(doc: dict) -> dict:
    if doc and "_id" in doc:
        doc["id"] = str(doc["_id"])
        doc["_id"] = str(doc["_id"])
    return doc


# ---------------------------------------------------------------------------
# Main dependency — verify Clerk JWT and return (or provision) the user
# ---------------------------------------------------------------------------
async def get_current_user(
    token: Optional[str] = Depends(reusable_oauth2),
) -> dict:
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    # Verify the Clerk JWT against the JWKS public keys
    try:
        jwks = await _get_jwks()
        payload = jwt.decode(
            token,
            jwks,
            algorithms=["RS256"],
            options={"verify_aud": False},
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )

    clerk_user_id: Optional[str] = payload.get("sub")
    if not clerk_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid token: missing subject",
        )

    db = get_database()

    # Look up user by Clerk ID
    user = await db.users.find_one({"clerkId": clerk_user_id})

    if not user:
        # Auto-provision on first API call — create a minimal user record
        user_doc = {
            "clerkId": clerk_user_id,
            "email": payload.get("email", ""),
            "name": payload.get("name", "") or payload.get("username", ""),
            "createdAt": datetime.utcnow(),
        }
        result = await db.users.insert_one(user_doc)
        user = await db.users.find_one({"_id": ObjectId(result.inserted_id)})

    return fix_id(user)
