from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(CategoryBase):
    pass

class CategoryInDB(CategoryBase):
    id: str = Field(..., validation_alias="_id")
    restaurantId: str
    itemCount: int = 0
    createdAt: datetime

    class Config:
        populate_by_name = True

class Category(CategoryInDB):
    pass
