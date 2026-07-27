from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import logging

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from database import create_indexes
from auth import auth_router, seed_admin
from routes_content import api as content_router
from seed_data import seed_all

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(title="Apexora Studio API")

app.include_router(auth_router)
app.include_router(content_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/")
async def root():
    return {"status": "ok", "service": "Apexora Studio API"}


@app.on_event("startup")
async def on_startup():
    try:
        await create_indexes()
    except Exception as e:
        logger.error(f"Index creation issue: {e}")

    try:
        await seed_admin()
    except Exception as e:
        logger.error(f"Admin seed issue: {e}")

    # Content seed disabled to prevent overwriting admin content
