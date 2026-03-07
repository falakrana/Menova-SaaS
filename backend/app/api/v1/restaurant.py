from typing import Any
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
            "name": current_user.get("name", "My Restaurant"),
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
            
    restaurant = await db.restaurants.find_one_and_update(
        {"userId": str(current_user["_id"])},
        {"$set": update_data},
        return_document=True
    )
    
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    return deps.fix_id(restaurant)
