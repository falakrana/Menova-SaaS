import os
import json
from pydantic_settings import BaseSettings
from typing import List
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "Menova API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-super-secret-key-change-me-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 1 week
    
    # MongoDB
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "menova_db")
    
    # Cloudflare R2
    CF_R2_ACCOUNT_ID: str = os.getenv("CF_R2_ACCOUNT_ID", "")
    CF_R2_ACCESS_KEY_ID: str = os.getenv("CF_R2_ACCESS_KEY_ID", "")
    CF_R2_SECRET_ACCESS_KEY: str = os.getenv("CF_R2_SECRET_ACCESS_KEY", "")
    CF_R2_BUCKET_NAME: str = os.getenv("CF_R2_BUCKET_NAME", "menova-images")
    CF_R2_PUBLIC_URL: str = os.getenv("CF_R2_PUBLIC_URL", "")  # e.g., https://pub-xxx.r2.dev or custom domain

    PUBLIC_APP_URL: str = os.getenv("PUBLIC_APP_URL")
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = []

    def __init__(self, **values):
        super().__init__(**values)
        raw = os.getenv("BACKEND_CORS_ORIGINS")
        if raw:
            try:
                parsed = json.loads(raw)
                if isinstance(parsed, list):
                    self.BACKEND_CORS_ORIGINS = [str(o) for o in parsed]
            except Exception:
                # If parsing fails, keep defaults below
                pass

        if not self.BACKEND_CORS_ORIGINS:
            self.BACKEND_CORS_ORIGINS = [
                "https://menova.vercel.app",
                "http://localhost:5173",  # Vite default
                "http://localhost:8080",  # Custom Vite port in this project
                "http://127.0.0.1:5173",
                "http://127.0.0.1:8080",
            ]
    
    class Config:
        case_sensitive = True

settings = Settings()
