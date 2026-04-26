

from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
import io
from PIL import Image

from app.api.v1 import deps
from app.services.storage import storage_service

router = APIRouter()


@router.post("/image")
async def upload_image(
    folder: str = "others",
    file: UploadFile = File(...),
    current_user: dict = Depends(deps.get_current_user),
) -> dict:
    # 1. Initial basic check
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Read the raw content
        content = await file.read()
        
        # 2. Layer 1 & 2: Validate Magic Bytes and Image Structure
        try:
            # We wrap the content in a BytesIO "fake file"
            image_buffer = io.BytesIO(content)
            img = Image.open(image_buffer)
            
            # Verify the image integrity
            img.verify()
            
            # Re-open because verify() consumes the buffer
            image_buffer.seek(0)
            img = Image.open(image_buffer)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid image file or disguised script detected.")

        # 3. Layer 3: Strip Metadata and Sanitize (Janitor)
        # We re-save the image to a new buffer. This kills any hidden scripts or EXIF metadata.
        cleaned_buffer = io.BytesIO()
        
        # Keep the original format (JPEG, PNG, etc.)
        img_format = img.format if img.format else "JPEG"
        
        # Convert to RGB/RGBA to ensure we are only saving pixel data
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGBA")
        else:
            img = img.convert("RGB")
            
        img.save(cleaned_buffer, format=img_format)
        cleaned_content = cleaned_buffer.getvalue()
        
        # Determine final extension based on the verified format
        extension = f".{img_format.lower()}"
        if extension == ".jpeg":
            extension = ".jpg"

        # 4. Upload to R2 (Layer 4)
        url = await storage_service.upload_file(
            file_content=cleaned_content,
            filename=f"image{extension}", # We use a generic name; service will UUID it
            content_type=f"image/{img_format.lower()}",
            folder=folder
        )
        
        return {
            "filename": file.filename,
            "url": url
        }
        
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process and upload image: {str(e)}")





