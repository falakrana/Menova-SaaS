from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from app.api.v1 import deps
from app.services.storage import storage_service

router = APIRouter()

@router.post("/image")
async def upload_image(
    folder: str = "others",
    file: UploadFile = File(...),
    current_user: dict = Depends(deps.get_current_user),
) -> dict:
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        content = await file.read()
        url = await storage_service.upload_file(
            file_content=content,
            filename=file.filename,
            content_type=file.content_type,
            folder=folder
        )
        
        return {
            "filename": file.filename,
            "url": url
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")

