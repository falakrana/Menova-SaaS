

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


from pydantic import BaseModel

class ImageUrlRequest(BaseModel):
    url: str
    folder: str = "others"

@router.post("/image-url")
async def upload_image_from_url(
    request: ImageUrlRequest,
    current_user: dict = Depends(deps.get_current_user),
) -> dict:
    import httpx
    import base64
    import re
    
    url = request.url
    folder = request.folder
    
    try:
        content = None
        
        # 1. Handle Base64 Data URI
        if url.startswith("data:image/"):
            try:
                # Format: data:image/jpeg;base64,/9j/4AAQSkZJRg...
                header, encoded = url.split(",", 1)
                content = base64.b64decode(encoded)
            except Exception:
                raise HTTPException(status_code=400, detail="Invalid Base64 data provided")
        
        # 2. Handle HTTP/S URL
        else:
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
            async with httpx.AsyncClient(headers=headers) as client:
                response = await client.get(url, follow_redirects=True, timeout=15.0)
                if response.status_code != 200:
                    raise HTTPException(status_code=400, detail=f"Could not fetch image from URL (Status: {response.status_code})")
                
                content_type = response.headers.get("content-type", "")
                if not content_type.startswith("image/"):
                    raise HTTPException(status_code=400, detail="URL does not point to a valid image")
                
                content = response.content
        
        if not content:
            raise HTTPException(status_code=400, detail="No image content found")

        # 3. Validation & Processing logic
        try:
            image_buffer = io.BytesIO(content)
            img = Image.open(image_buffer)
            img.verify()
            image_buffer.seek(0)
            img = Image.open(image_buffer)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid image content or disguised script detected.")

        cleaned_buffer = io.BytesIO()
        img_format = img.format if img.format else "JPEG"
        
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGBA")
        else:
            img = img.convert("RGB")
            
        img.save(cleaned_buffer, format=img_format)
        cleaned_content = cleaned_buffer.getvalue()
        
        extension = f".{img_format.lower()}"
        if extension == ".jpeg":
            extension = ".jpg"

        cloud_url = await storage_service.upload_file(
            file_content=cleaned_content,
            filename=f"image{extension}",
            content_type=f"image/{img_format.lower()}",
            folder=folder
        )
        
        return {
            "filename": "image" if url.startswith("data:") else (url.split("/")[-1].split("?")[0] or "image"),
            "url": cloud_url
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process image: {str(e)}")





