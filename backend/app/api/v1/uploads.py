from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from app.api.v1 import deps
from app.core.database import get_database
from motor.motor_asyncio import AsyncIOMotorGridFSBucket
import bson

router = APIRouter()

@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    current_user: dict = Depends(deps.get_current_user),
) -> dict:
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    db = get_database()
    fs = AsyncIOMotorGridFSBucket(db)
    
    file_id = await fs.upload_from_stream(
        file.filename,
        file.file,
        metadata={"contentType": file.content_type}
    )
    
    # In a real app, you'd serve this via a GET endpoint
    return {
        "filename": file.filename,
        "id": str(file_id),
        "url": f"/api/v1/uploads/image/{file_id}"
    }

from fastapi.responses import Response

@router.get("/image/{file_id}")
async def get_image(file_id: str):
    db = get_database()
    fs = AsyncIOMotorGridFSBucket(db)
    
    try:
        grid_out = await fs.open_download_stream(bson.ObjectId(file_id))
        content = await grid_out.read()
        return Response(
            content=content,
            media_type=grid_out.metadata.get("contentType", "image/png")
        )
    except Exception:
        raise HTTPException(status_code=404, detail="Image not found")
