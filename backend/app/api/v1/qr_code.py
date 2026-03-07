from fastapi import APIRouter, Depends
from app.api.v1 import deps
from bson import ObjectId
import qrcode
import io
import base64

router = APIRouter()

@router.get("/{restaurant_id}")
async def generate_qr_code(
    restaurant_id: str,
    current_user: dict = Depends(deps.get_current_user),
) -> dict:
    from fastapi import HTTPException
    from app.core.database import get_database
    
    db = get_database()
    restaurant = await db.restaurants.find_one({"_id": ObjectId(restaurant_id), "userId": str(current_user["_id"])})
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found or access denied")

    # In a real SaaS, this would be the URL to the public menu
    # Use localhost:8080 as it's the port being used in the frontend dev server for this project
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
    
    # Convert image to base64
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    
    return {
        "restaurant_id": restaurant_id,
        "menu_url": menu_url,
        "qr_code_base64": f"data:image/png;base64,{img_str}"
    }
