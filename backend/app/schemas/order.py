from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional, Literal
from app.schemas.menu_item import MenuItem

class CartItem(BaseModel):
    menuItem: MenuItem
    quantity: int

class OrderBase(BaseModel):
    tableNumber: int
    items: List[CartItem]
    total: float
    status: Literal['pending', 'preparing', 'ready', 'completed'] = 'pending'

class OrderCreate(OrderBase):
    restaurantId: str

class OrderUpdateStatus(BaseModel):
    status: Literal['pending', 'preparing', 'ready', 'completed']

class OrderInDB(OrderBase):
    id: str = Field(..., validation_alias="_id")
    restaurantId: str
    createdAt: datetime

    class Config:
        populate_by_name = True

class Order(OrderInDB):
    pass
