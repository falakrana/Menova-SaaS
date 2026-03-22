from typing import Any, List
from fastapi import APIRouter, HTTPException
from app.core.database import get_database
from app.schemas.menu_item import MenuItem
from app.schemas.category import Category
from app.schemas.order import Order, OrderCreate
from app.api.v1 import deps
from bson import ObjectId
from datetime import datetime

router = APIRouter()

@router.get("/menu/{restaurant_id}")
async def get_public_menu(restaurant_id: str) -> Any:
    db = get_database()
    restaurant = await db.restaurants.find_one_and_update(
        {"_id": ObjectId(restaurant_id)},
        {"$inc": {"menuViews": 1}},
        return_document=True
    )
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    categories_cursor = db.categories.find({"restaurantId": restaurant_id})
    categories = await categories_cursor.to_list(length=100)
    
    items_cursor = db.menu_items.find({"restaurantId": restaurant_id, "available": True})
    items = await items_cursor.to_list(length=1000)
    
    return {
        "restaurant": deps.fix_id(restaurant),
        "categories": [deps.fix_id(c) for c in categories],
        "menuItems": [deps.fix_id(i) for i in items]
    }

@router.post("/orders", response_model=Order)
async def place_order(order_in: OrderCreate) -> Any:
    db = get_database()
    order_dict = order_in.model_dump()
    order_dict["createdAt"] = datetime.utcnow()
    order_dict["status"] = "pending"
    
    result = await db.orders.insert_one(order_dict)
    order_dict["_id"] = str(result.inserted_id)
    return order_dict
