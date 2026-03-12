import aioboto3
from app.core.config import settings
import uuid
import os

class StorageService:
    def __init__(self):
        self.session = aioboto3.Session()
        self.endpoint_url = f"https://{settings.CF_R2_ACCOUNT_ID}.r2.cloudflarestorage.com"
        self.access_key = settings.CF_R2_ACCESS_KEY_ID
        self.secret_key = settings.CF_R2_SECRET_ACCESS_KEY
        self.bucket_name = settings.CF_R2_BUCKET_NAME
        self.public_url = settings.CF_R2_PUBLIC_URL.rstrip("/")

    async def upload_file(self, file_content: bytes, filename: str, content_type: str, folder: str = "others") -> str:
        # Generate a unique filename to avoid collisions
        ext = os.path.splitext(filename)[1]
        unique_filename = f"{uuid.uuid4()}{ext}"
        
        # Build the path
        key = f"images/{folder}/{unique_filename}"
        
        async with self.session.client(
            "s3",
            endpoint_url=self.endpoint_url,
            aws_access_key_id=self.access_key,
            aws_secret_access_key=self.secret_key,
        ) as s3:
            await s3.put_object(
                Bucket=self.bucket_name,
                Key=key,
                Body=file_content,
                ContentType=content_type,
            )
            
        if self.public_url:
            return f"{self.public_url}/{key}"
        else:
            return f"{self.endpoint_url}/{self.bucket_name}/{key}"

storage_service = StorageService()
