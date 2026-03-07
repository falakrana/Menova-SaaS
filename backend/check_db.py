import motor.motor_asyncio
import asyncio

async def main():
    client = motor.motor_asyncio.AsyncIOMotorClient('mongodb://localhost:27017')
    db = client['menova_db']
    users = await db.users.find().to_list(100)
    print("USERS:", users)

asyncio.run(main())
