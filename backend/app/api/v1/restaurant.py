from typing import Any
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from app.api.v1 import deps
from app.core import security
from app.core.database import get_database
from app.schemas.restaurant import Restaurant, RestaurantUpdate, RestaurantCreate
from bson import ObjectId

router = APIRouter()

@router.get("", response_model=Restaurant)
async def get_restaurant(
    current_user: dict = Depends(deps.get_current_user),
) -> Any:
    db = get_database()
    restaurant = await db.restaurants.find_one({"userId": str(current_user["_id"])})
    if not restaurant:
        # Create a default restaurant if not exists
        default_restaurant = {
            "name": "",
            "email": current_user["email"],
            "phone": "",
            "location": "",
            "themeColor": "#3b82f6",
            "backgroundColor": "#ffffff",
            "fontStyle": "Inter",
            "userId": str(current_user["_id"])
        }
        result = await db.restaurants.insert_one(default_restaurant)
        default_restaurant["_id"] = str(result.inserted_id)
        return default_restaurant
    
    return deps.fix_id(restaurant)

@router.put("", response_model=Restaurant)
async def update_restaurant(
    restaurant_in: RestaurantUpdate,
    current_user: dict = Depends(deps.get_current_user),
) -> Any:
    db = get_database()
    update_data = restaurant_in.model_dump(exclude_unset=True)
    
    # Sanitize inputs
    for key in ["name", "location", "fontStyle"]:
        if key in update_data and isinstance(update_data[key], str):
            update_data[key] = security.sanitize_text(update_data[key])

    if "name" in update_data:
        update_data["name"] = update_data["name"].strip()
        if not update_data["name"]:
            raise HTTPException(status_code=422, detail="Restaurant name is required")
            
    restaurant = await db.restaurants.find_one_and_update(
        {"userId": str(current_user["_id"])},
        {"$set": update_data},
        return_document=True
    )
    
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    return deps.fix_id(restaurant)

@router.get("/stats")
async def get_restaurant_stats(
    current_user: dict = Depends(deps.get_current_user),
) -> Any:
    db = get_database()
    restaurant = await db.restaurants.find_one({"userId": str(current_user["_id"])})
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    restaurant_id = str(restaurant["_id"])
    
    total_categories = await db.categories.count_documents({"restaurantId": restaurant_id})
    total_items = await db.menu_items.count_documents({"restaurantId": restaurant_id})

    
    # Calculate popular item based on highest likesCount
    popular_item_doc = await db.menu_items.find({"restaurantId": restaurant_id}).sort("likesCount", -1).limit(1).to_list(length=1)
    popular_item = popular_item_doc[0]["name"] if popular_item_doc and popular_item_doc[0].get("likesCount", 0) > 0 else "None"

    return {
        "menuViews": restaurant.get("menuViews", 0),
        "totalCategories": total_categories,
        "totalItems": total_items,

        "popularItem": popular_item,
        "qrCodeActive": True, # Assuming active if restaurant exists
        "qrScans": restaurant.get("qrScans", 0)
    }

@router.get("/analytics/views")
async def get_views_analytics(
    start_date: datetime,
    end_date: datetime,
    current_user: dict = Depends(deps.get_current_user),
) -> Any:
    db = get_database()
    restaurant = await db.restaurants.find_one({"userId": str(current_user["_id"])})
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
        
    restaurant_id = str(restaurant["_id"])
    
    pipeline = [
        {
            "$match": {
                "restaurantId": restaurant_id,
                "timestamp": {"$gte": start_date, "$lte": end_date}
            }
        },
        {
            "$project": {
                "day": {"$dateToString": {"format": "%Y-%m-%d", "date": "$timestamp"}}
            }
        },
        {
            "$group": {
                "_id": "$day",
                "views": {"$sum": 1}
            }
        },
        {"$sort": {"_id": 1}}
    ]
    
    results = await db.menu_views.aggregate(pipeline).to_list(length=1000)
    # Format for frontend
    return [{"date": r["_id"], "views": r["views"]} for r in results]

@router.delete("/analytics/views/reset")
async def reset_views_analytics(
    current_user: dict = Depends(deps.get_current_user),
) -> Any:
    db = get_database()
    restaurant = await db.restaurants.find_one({"userId": str(current_user["_id"])})
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
        
    restaurant_id = str(restaurant["_id"])
    
    # 1. Delete all menu_views for this restaurant
    await db.menu_views.delete_many({"restaurantId": restaurant_id})
    
    # 2. Reset menuViews and qrScans in restaurant document
    await db.restaurants.update_one(
        {"_id": restaurant["_id"]},
        {"$set": {"menuViews": 0, "qrScans": 0}}
    )
    
    return {"message": "Analytics reset successfully"}
