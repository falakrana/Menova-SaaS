from pydantic import BaseModel, Field
from typing import Optional

class RestaurantBase(BaseModel):
    name: str
    email: str
    phone: str
    location: str
    logo: Optional[str] = None
    logoUrl: Optional[str] = None
    themeColor: str
    accentColor: Optional[str] = "#f97316"
    backgroundColor: str
    fontStyle: str
    bodyFont: Optional[str] = "Roboto"
    tagline: Optional[str] = None
    menuTextSize: Optional[str] = "md"
    currency: Optional[str] = "INR"
    priceFormat: Optional[str] = "PREFIX_SPACE"
    menuAlignment: Optional[str] = "left"
    showDescriptions: Optional[bool] = True
    layout: Optional[str] = "classic"
    menuViews: Optional[int] = 0

class RestaurantCreate(RestaurantBase):
    pass

class RestaurantUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    logo: Optional[str] = None
    logoUrl: Optional[str] = None
    themeColor: Optional[str] = None
    accentColor: Optional[str] = None
    backgroundColor: Optional[str] = None
    fontStyle: Optional[str] = None
    bodyFont: Optional[str] = None
    tagline: Optional[str] = None
    menuTextSize: Optional[str] = None
    currency: Optional[str] = None
    priceFormat: Optional[str] = None
    menuAlignment: Optional[str] = None
    showDescriptions: Optional[bool] = None
    layout: Optional[str] = None

class RestaurantInDB(RestaurantBase):
    id: str = Field(..., validation_alias="_id")
    userId: str

    class Config:
        populate_by_name = True

class Restaurant(RestaurantInDB):
    pass
