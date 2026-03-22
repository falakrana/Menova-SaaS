from fastapi import APIRouter, Depends, HTTPException

from app.api.v1 import deps

from app.core.database import get_database

from app.services.storage import storage_service

from bson import ObjectId

import qrcode

import io



router = APIRouter()



@router.get("/{restaurant_id}")

async def generate_qr_code(

    restaurant_id: str,

    current_user: dict = Depends(deps.get_current_user),

) -> dict:

    db = get_database()

    restaurant = await db.restaurants.find_one({"_id": ObjectId(restaurant_id), "userId": str(current_user["_id"])})

    if not restaurant:

        raise HTTPException(status_code=404, detail="Restaurant not found or access denied")



    # Check if QR code already exists

    if restaurant.get("qrCodeUrl"):

        return {

            "restaurant_id": restaurant_id,

            "menu_url": f"http://localhost:8080/menu/{restaurant_id}",

            "qr_code_url": restaurant["qrCodeUrl"]

        }



    # Generate new QR code only if it doesn't exist

    menu_url = f"http://localhost:8080/menu/{restaurant_id}" 



    

    qr = qrcode.QRCode(

        version=1,

        error_correction=qrcode.constants.ERROR_CORRECT_L,

        box_size=10,

        border=4,

    )

    qr.add_data(menu_url)

    qr.make(fit=True)



    img = qr.make_image(fill_color="black", back_color="white")

    

    # Save image to buffer

    buffered = io.BytesIO()

    img.save(buffered, format="PNG")

    img_content = buffered.getvalue()

    

    # Upload to R2

    try:

        qr_url = await storage_service.upload_file(

            file_content=img_content,

            filename=f"qr_{restaurant_id}.png",

            content_type="image/png",

            folder="qr-codes"

        )

        

        # Update restaurant document with the QR URL

        await db.restaurants.update_one(

            {"_id": ObjectId(restaurant_id)},

            {"$set": {"qrCodeUrl": qr_url}}

        )

        

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


    # Always generate a new QR code for regeneration

    menu_url = f"http://localhost:8080/menu/{restaurant_id}" 


    qr = qrcode.QRCode(

        version=1,

        error_correction=qrcode.constants.ERROR_CORRECT_L,

        box_size=10,

        border=4,

    )

    qr.add_data(menu_url)

    qr.make(fit=True)


    img = qr.make_image(fill_color="black", back_color="white")


    # Save image to buffer

    buffered = io.BytesIO()

    img.save(buffered, format="PNG")

    img_content = buffered.getvalue()


    # Upload to R2

    try:

        qr_url = await storage_service.upload_file(

            file_content=img_content,

            filename=f"qr_{restaurant_id}.png",

            content_type="image/png",

            folder="qr-codes"

        )


        # Update restaurant document with the QR URL

        await db.restaurants.update_one(

            {"_id": ObjectId(restaurant_id)},

            {"$set": {"qrCodeUrl": qr_url}}

        )


        return {

            "restaurant_id": restaurant_id,

            "menu_url": menu_url,

            "qr_code_url": qr_url

        }

    except Exception as e:

        raise HTTPException(status_code=500, detail=f"Failed to store QR code: {str(e)}")

