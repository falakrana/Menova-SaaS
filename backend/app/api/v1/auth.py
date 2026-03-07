from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.core import security
from app.core.config import settings
from app.core.database import get_database
from app.schemas.user import User, UserCreate
from app.schemas.token import Token
from app.api.v1 import deps
from datetime import datetime
from bson import ObjectId

router = APIRouter()

@router.post("/register", response_model=User)
async def register(user_in: UserCreate) -> Any:
    db = get_database()
    user = await db.users.find_one({"email": user_in.email})
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    
    user_dict = user_in.model_dump()
    password = user_dict.pop("password")
    user_dict["hashedPassword"] = security.get_password_hash(password)
    user_dict["createdAt"] = datetime.utcnow()
    
    result = await db.users.insert_one(user_dict)
    user_dict["_id"] = str(result.inserted_id)
    return user_dict

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()) -> Any:
    db = get_database()
    user = await db.users.find_one({"email": form_data.username})
    if not user or not security.verify_password(form_data.password, user["hashedPassword"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user["_id"], expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.get("/me", response_model=User)
async def read_user_me(
    current_user: dict = Depends(deps.get_current_user),
) -> Any:
    return current_user
