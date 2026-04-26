from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from app.api.v1 import deps
from app.core import security
from app.core.database import get_database
from app.schemas.category import Category, CategoryCreate, CategoryUpdate
from app.schemas.menu_item import MenuItem, MenuItemCreate, MenuItemUpdate
from bson import ObjectId
from datetime import datetime

router = APIRouter()

# --- Categories ---

@router.get("/categories", response_model=List[Category])
async def list_categories(
    current_user: dict = Depends(deps.get_current_user),
) -> Any:
    db = get_database()
    restaurant = await db.restaurants.find_one({"userId": str(current_user["_id"])})
    if not restaurant:
        return []
    
    cursor = db.categories.find({"restaurantId": str(restaurant["_id"])})
    categories = await cursor.to_list(length=100)
    return [deps.fix_id(c) for c in categories]

@router.post("/categories", response_model=Category)
async def create_category(
    category_in: CategoryCreate,
    current_user: dict = Depends(deps.get_current_user),
) -> Any:
    db = get_database()
    restaurant = await db.restaurants.find_one({"userId": str(current_user["_id"])})
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    category_dict = category_in.model_dump()
    category_dict["name"] = security.sanitize_text(category_dict.get("name", ""))
    category_dict["restaurantId"] = str(restaurant["_id"])
    category_dict["itemCount"] = 0
    category_dict["createdAt"] = datetime.utcnow()
    
    result = await db.categories.insert_one(category_dict)
    category_dict["_id"] = str(result.inserted_id)
    return category_dict

@router.put("/categories/{id}", response_model=Category)
async def update_category(
    id: str,
    category_in: CategoryUpdate,
    current_user: dict = Depends(deps.get_current_user),
) -> Any:
    db = get_database()
    restaurant = await db.restaurants.find_one({"userId": str(current_user["_id"])})
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
        
    update_data = category_in.model_dump()
    if "name" in update_data:
        update_data["name"] = security.sanitize_text(update_data["name"])
        
    category = await db.categories.find_one_and_update(
        {"_id": ObjectId(id), "restaurantId": str(restaurant["_id"])},
        {"$set": update_data},
        return_document=True
    )
    if not category:
        raise HTTPException(status_code=404, detail="Category not found or access denied")
    return deps.fix_id(category)

@router.delete("/categories/{id}")
async def delete_category(
    id: str,
    current_user: dict = Depends(deps.get_current_user),
) -> Any:
    db = get_database()
    restaurant = await db.restaurants.find_one({"userId": str(current_user["_id"])})
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
        
    result = await db.categories.delete_one({"_id": ObjectId(id), "restaurantId": str(restaurant["_id"])})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Category not found or access denied")
    
    # Also delete items in this category
    await db.menu_items.delete_many({"categoryId": id, "restaurantId": str(restaurant["_id"])})
    return {"message": "Category deleted"}

# --- Menu Items ---

@router.get("/menu-items", response_model=List[MenuItem])
async def list_menu_items(
    category_id: Optional[str] = None,
    current_user: dict = Depends(deps.get_current_user),
) -> Any:
    db = get_database()
    restaurant = await db.restaurants.find_one({"userId": str(current_user["_id"])})
    if not restaurant:
        return []
    
    query = {"restaurantId": str(restaurant["_id"])}
    if category_id:
        query["categoryId"] = category_id
        
    cursor = db.menu_items.find(query)
    items = await cursor.to_list(length=1000)
    return [deps.fix_id(i) for i in items]

@router.post("/menu-items", response_model=MenuItem)
async def create_menu_item(
    item_in: MenuItemCreate,
    current_user: dict = Depends(deps.get_current_user),
) -> Any:
    db = get_database()
    restaurant = await db.restaurants.find_one({"userId": str(current_user["_id"])})
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    # Verify that the category belongs to this restaurant
    category = await db.categories.find_one({
        "_id": ObjectId(item_in.categoryId),
        "restaurantId": str(restaurant["_id"])
    })
    if not category:
        raise HTTPException(status_code=404, detail="Category not found or access denied")

    item_dict = item_in.model_dump()
    for key in ["name", "description"]:
        if key in item_dict and isinstance(item_dict[key], str):
            item_dict[key] = security.sanitize_text(item_dict[key])
            
    item_dict["restaurantId"] = str(restaurant["_id"])
    item_dict["createdAt"] = datetime.utcnow()
    
    result = await db.menu_items.insert_one(item_dict)
    
    # Update category item count (now verified to belong to this restaurant)
    await db.categories.update_one(
        {"_id": ObjectId(item_in.categoryId), "restaurantId": str(restaurant["_id"])},
        {"$inc": {"itemCount": 1}}
    )
    
    item_dict["_id"] = str(result.inserted_id)
    return item_dict

@router.put("/menu-items/{id}", response_model=MenuItem)
async def update_menu_item(
    id: str,
    item_in: MenuItemUpdate,
    current_user: dict = Depends(deps.get_current_user),
) -> Any:
    db = get_database()
    restaurant = await db.restaurants.find_one({"userId": str(current_user["_id"])})
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
        
    update_data = item_in.model_dump(exclude_unset=True)
    for key in ["name", "description"]:
        if key in update_data and isinstance(update_data[key], str):
            update_data[key] = security.sanitize_text(update_data[key])
            
    # Fetch old item to check category change
    old_item = await db.menu_items.find_one({"_id": ObjectId(id), "restaurantId": str(restaurant["_id"])})
    if not old_item:
        raise HTTPException(status_code=404, detail="Menu item not found or access denied")

    # If category is changing, verify ownership of new category and update counts
    if "categoryId" in update_data and update_data["categoryId"] != old_item["categoryId"]:
        new_category = await db.categories.find_one({
            "_id": ObjectId(update_data["categoryId"]),
            "restaurantId": str(restaurant["_id"])
        })
        if not new_category:
            raise HTTPException(status_code=400, detail="New category not found or access denied")
        
        # Decrement old category count
        await db.categories.update_one(
            {"_id": ObjectId(old_item["categoryId"]), "restaurantId": str(restaurant["_id"])},
            {"$inc": {"itemCount": -1}}
        )
        
        # Increment new category count
        await db.categories.update_one(
            {"_id": ObjectId(update_data["categoryId"]), "restaurantId": str(restaurant["_id"])},
            {"$inc": {"itemCount": 1}}
        )

    item = await db.menu_items.find_one_and_update(
        {"_id": ObjectId(id), "restaurantId": str(restaurant["_id"])},
        {"$set": update_data},
        return_document=True
    )
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found or access denied")
    return deps.fix_id(item)

@router.delete("/menu-items/{id}")
async def delete_menu_item(
    id: str,
    current_user: dict = Depends(deps.get_current_user),
) -> Any:
    db = get_database()
    restaurant = await db.restaurants.find_one({"userId": str(current_user["_id"])})
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
        
    item = await db.menu_items.find_one({"_id": ObjectId(id), "restaurantId": str(restaurant["_id"])})
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found or access denied")
    
    await db.menu_items.delete_one({"_id": ObjectId(id)})
    
    # Update category item count
    await db.categories.update_one(
        {"_id": ObjectId(item["categoryId"]), "restaurantId": str(restaurant["_id"])},
        {"$inc": {"itemCount": -1}}
    )
    
    return {"message": "Menu item deleted"}
