import os
from motor.motor_asyncio import AsyncIOMotorClient

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]


async def create_indexes():
    await db.users.create_index("email", unique=True)
    await db.password_reset_tokens.create_index("expires_at", expireAfterSeconds=0)
    await db.login_attempts.create_index("identifier")
    await db.portfolio.create_index("slug", unique=True)
    await db.case_studies.create_index("slug", unique=True)
    await db.posts.create_index("slug", unique=True)
    await db.services.create_index("slug", unique=True)
