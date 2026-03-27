from fastapi import APIRouter, Depends, HTTPException

from app.api.v1 import deps

from app.core.database import get_database

from app.services.storage import storage_service

from app.core.config import settings

from bson import ObjectId

import qrcode

import io



router = APIRouter()


async def _create_and_store_qr(db, restaurant_id: str, menu_url: str) -> str:
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(menu_url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")

    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    img_content = buffered.getvalue()

    qr_url = await storage_service.upload_file(
        file_content=img_content,
        filename=f"qr_{restaurant_id}.png",
        content_type="image/png",
        folder="qr-codes",
    )

    await db.restaurants.update_one(
        {"_id": ObjectId(restaurant_id)},
        {"$set": {"qrCodeUrl": qr_url, "qrMenuUrl": menu_url}},
    )

    return qr_url


@router.get("/{restaurant_id}")

async def generate_qr_code(

    restaurant_id: str,

    current_user: dict = Depends(deps.get_current_user),

) -> dict:

    db = get_database()

    restaurant = await db.restaurants.find_one({"_id": ObjectId(restaurant_id), "userId": str(current_user["_id"])})

    if not restaurant:

        raise HTTPException(status_code=404, detail="Restaurant not found or access denied")



    menu_url = f"{settings.PUBLIC_APP_URL.rstrip('/')}/menu/{restaurant_id}"

    if restaurant.get("qrCodeUrl") and restaurant.get("qrMenuUrl") == menu_url:

        return {

            "restaurant_id": restaurant_id,

            "menu_url": menu_url,

            "qr_code_url": restaurant["qrCodeUrl"]

        }



    try:

        qr_url = await _create_and_store_qr(db, restaurant_id, menu_url)

        return {

            "restaurant_id": restaurant_id,

            "menu_url": menu_url,

            "qr_code_url": qr_url

        }

    except Exception as e:

        raise HTTPException(status_code=500, detail=f"Failed to store QR code: {str(e)}")



@router.post("/{restaurant_id}/regenerate")

async def regenerate_qr_code(

    restaurant_id: str,

    current_user: dict = Depends(deps.get_current_user),

) -> dict:

    db = get_database()

    restaurant = await db.restaurants.find_one({"_id": ObjectId(restaurant_id), "userId": str(current_user["_id"])})


    if not restaurant:

        raise HTTPException(status_code=404, detail="Restaurant not found or access denied")


    menu_url = f"{settings.PUBLIC_APP_URL.rstrip('/')}/menu/{restaurant_id}"



    try:

        qr_url = await _create_and_store_qr(db, restaurant_id, menu_url)

        return {

            "restaurant_id": restaurant_id,

            "menu_url": menu_url,

            "qr_code_url": qr_url

        }

    except Exception as e:

        raise HTTPException(status_code=500, detail=f"Failed to store QR code: {str(e)}")

