from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class MenuItemBase(BaseModel):
    name: str
    description: str
    price: float
    image: Optional[str] = None
    categoryId: str
    categoryName: str
    available: bool = True
    likesCount: int = 0
    isVeg: bool = False
    isSpicy: bool = False
    isGlutenFree: bool = False
    specifications: list[str] = []

class MenuItemCreate(MenuItemBase):
    pass

class MenuItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    image: Optional[str] = None
    categoryId: Optional[str] = None
    categoryName: Optional[str] = None
    available: Optional[bool] = None
    isVeg: Optional[bool] = None
    isSpicy: Optional[bool] = None
    isGlutenFree: Optional[bool] = None
    specifications: Optional[list[str]] = None

class MenuItemInDB(MenuItemBase):
    id: str = Field(..., validation_alias="_id")
    createdAt: datetime

    class Config:
        populate_by_name = True

class MenuItem(MenuItemInDB):
    pass
