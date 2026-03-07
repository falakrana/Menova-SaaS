from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from app.api.v1 import deps
from app.core.database import get_database
from app.schemas.order import Order, OrderUpdateStatus
from bson import ObjectId

router = APIRouter()

@router.get("", response_model=List[Order])
async def list_orders(
    current_user: dict = Depends(deps.get_current_user),
) -> Any:
    db = get_database()
    restaurant = await db.restaurants.find_one({"userId": str(current_user["_id"])})
    if not restaurant:
        return []
    
    cursor = db.orders.find({"restaurantId": str(restaurant["_id"])}).sort("createdAt", -1)
    orders = await cursor.to_list(length=100)
    return [deps.fix_id(o) for o in orders]

@router.put("/{id}/status", response_model=Order)
async def update_order_status(
    id: str,
    status_in: OrderUpdateStatus,
    current_user: dict = Depends(deps.get_current_user),
) -> Any:
    db = get_database()
    restaurant = await db.restaurants.find_one({"userId": str(current_user["_id"])})
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
        
    order = await db.orders.find_one_and_update(
        {"_id": ObjectId(id), "restaurantId": str(restaurant["_id"])},
        {"$set": {"status": status_in.status}},
        return_document=True
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found or access denied")
    return deps.fix_id(order)
