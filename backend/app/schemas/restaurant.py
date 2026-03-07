from pydantic import BaseModel, Field
from typing import Optional

class RestaurantBase(BaseModel):
    name: str
    email: str
    phone: str
    location: str
    logo: Optional[str] = None
    themeColor: str
    backgroundColor: str
    fontStyle: str

class RestaurantCreate(RestaurantBase):
    pass

class RestaurantUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    logo: Optional[str] = None
    themeColor: Optional[str] = None
    backgroundColor: Optional[str] = None
    fontStyle: Optional[str] = None

class RestaurantInDB(RestaurantBase):
    id: str = Field(..., validation_alias="_id")
    userId: str

    class Config:
        populate_by_name = True

class Restaurant(RestaurantInDB):
    pass
