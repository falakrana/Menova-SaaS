from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

class Database:
    client: AsyncIOMotorClient = None
    db = None

db = Database()

async def connect_to_mongo():
    db.client = AsyncIOMotorClient(settings.MONGODB_URL)
    db.db = db.client[settings.DATABASE_NAME]
    
    try:
        await db.db.users.create_index("clerkId", unique=True)
    except Exception as e:
        print(f"Warning: Could not create unique index on users.clerkId (possibly due to existing duplicates): {e}")

async def close_mongo_connection():
    db.client.close()

def get_database():
    return db.db
