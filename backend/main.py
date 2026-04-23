from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import connect_to_mongo, close_mongo_connection
from app.api.v1 import auth, restaurant, menu, orders, public, qr_code, uploads

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

# Include routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(restaurant.router, prefix=f"{settings.API_V1_STR}/restaurant", tags=["restaurant"])
app.include_router(menu.router, prefix=settings.API_V1_STR, tags=["menu"]) # categories and menu-items already have prefixes in their routes
app.include_router(orders.router, prefix=f"{settings.API_V1_STR}/orders", tags=["orders"])
app.include_router(public.router, prefix=f"{settings.API_V1_STR}/public", tags=["public"])
app.include_router(qr_code.router, prefix=f"{settings.API_V1_STR}/qr-code", tags=["qr-code"])
app.include_router(uploads.router, prefix=f"{settings.API_V1_STR}/uploads", tags=["uploads"])

@app.api_route("/", methods=["GET", "HEAD"])
async def root():
    return {"message": "Welcome to Menova API"}
