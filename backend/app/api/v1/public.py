from fastapi import APIRouter, HTTPException, Request, Response
from app.core.database import get_database
from app.schemas.menu_item import MenuItem
from app.schemas.category import Category

from app.api.v1 import deps
from bson import ObjectId
from datetime import datetime
from typing import Any, List, Optional

router = APIRouter()

@router.get("/menu/{restaurant_id}")
async def get_public_menu(restaurant_id: str, request: Request, response: Response) -> Any:
    db = get_database()
    
    # Check for view cookie to prevent redundant increments (2-hour cooldown)
    cookie_name = f"menova_viewed_{restaurant_id}"
    has_viewed = request.cookies.get(cookie_name)
    
    if not has_viewed:
        # Increment total counter and log the individual view for analytics
        restaurant = await db.restaurants.find_one_and_update(
            {"_id": ObjectId(restaurant_id)},
            {"$inc": {"menuViews": 1}},
            return_document=True
        )
        
        # Log view event
        await db.menu_views.insert_one({
            "restaurantId": restaurant_id,
            "timestamp": datetime.utcnow(),
            "userAgent": request.headers.get("user-agent"),
            "ip": request.client.host if request.client else None
        })
        
        # Set cookie for 4 hours (14400 seconds)
        response.set_cookie(
            key=cookie_name, 
            value="true", 
            max_age=14400, 
            httponly=True, 
            samesite="lax"
        )
    else:
        # Just fetch
        restaurant = await db.restaurants.find_one({"_id": ObjectId(restaurant_id)})
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

@router.post("/items/{item_id}/like")
async def toggle_like_item(item_id: str, like: bool) -> Any:
    db = get_database()
    increment = 1 if like else -1
    
    result = await db.menu_items.find_one_and_update(
        {"_id": ObjectId(item_id)},
        {"$inc": {"likesCount": increment}},
        return_document=True
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="Item not found")
        
    return deps.fix_id(result)

