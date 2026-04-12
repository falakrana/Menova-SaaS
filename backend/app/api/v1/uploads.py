import base64
import json
from urllib import error as urlerror
from urllib import request as urlrequest

from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from pydantic import BaseModel

from app.api.v1 import deps
from app.core import security
from app.core.config import settings
from app.services.storage import storage_service

router = APIRouter()


class AIImageRequest(BaseModel):
    name: str
    description: str = ""
    categoryName: str = ""
    stylePrompt: str = ""


def _build_food_prompt(payload: AIImageRequest) -> str:
    name = security.sanitize_text(payload.name).strip()
    description = security.sanitize_text(payload.description).strip()
    category = security.sanitize_text(payload.categoryName).strip()
    style = security.sanitize_text(payload.stylePrompt).strip()

    prompt_parts = [
        f"A high-quality realistic food photo of {name}.",
        "Single plated dish, appetizing presentation, natural lighting, shallow depth of field.",
        "No people, no text, no watermark, no logo, clean background.",
    ]

    if category:
        prompt_parts.append(f"Cuisine context: {category}.")
    if description:
        prompt_parts.append(f"Dish details: {description}.")
    if style:
        prompt_parts.append(f"Visual style guidance: {style}.")

    return " ".join(prompt_parts)


def _generate_google_image(prompt: str) -> tuple[bytes, str]:
    if not settings.GOOGLE_API_KEY:
        raise HTTPException(status_code=400, detail="GOOGLE_API_KEY is not configured on the server")

    body = json.dumps(
        {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"responseModalities": ["TEXT", "IMAGE"]},
        }
    ).encode("utf-8")

    endpoint = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{settings.GOOGLE_IMAGE_MODEL}:generateContent?key={settings.GOOGLE_API_KEY}"
    )

    req = urlrequest.Request(
        endpoint,
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urlrequest.urlopen(req, timeout=60) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except urlerror.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="ignore")
        raise HTTPException(status_code=502, detail=f"Google image generation failed: {detail}")
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Google image generation failed: {str(exc)}")

    candidates = payload.get("candidates") or []
    for candidate in candidates:
        parts = ((candidate.get("content") or {}).get("parts")) or []
        for part in parts:
            inline_data = part.get("inlineData") or part.get("inline_data") or {}
            image_base64 = inline_data.get("data")
            mime_type = inline_data.get("mimeType") or inline_data.get("mime_type") or "image/png"
            if image_base64:
                try:
                    return base64.b64decode(image_base64), mime_type
                except Exception:
                    raise HTTPException(status_code=502, detail="Google image payload was invalid")

    raise HTTPException(
        status_code=502,
        detail="Google image generation returned no image data. Check GOOGLE_IMAGE_MODEL.",
    )

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


@router.post("/ai-image")
async def generate_ai_image(
    payload: AIImageRequest,
    current_user: dict = Depends(deps.get_current_user),
) -> dict:
    item_name = security.sanitize_text(payload.name).strip()
    if not item_name:
        raise HTTPException(status_code=400, detail="Item name is required to generate an image")

    prompt = _build_food_prompt(payload)
    image_bytes, mime_type = _generate_google_image(prompt)

    extension_map = {
        "image/png": ".png",
        "image/jpeg": ".jpg",
        "image/jpg": ".jpg",
        "image/webp": ".webp",
    }
    file_extension = extension_map.get(mime_type, ".png")

    try:
        url = await storage_service.upload_file(
            file_content=image_bytes,
            filename=f"{item_name.lower().replace(' ', '-')}{file_extension}",
            content_type=mime_type,
            folder="menu-items",
        )
        return {"url": url, "prompt": prompt}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to save generated image: {str(exc)}")

