from database import read_collection, write_collection
from datetime import datetime, timezone
import uuid


def now():
    return datetime.now(timezone.utc).isoformat()


async def seed_all():

    collections = [
        "settings",
        "pages",
        "services",
        "portfolio",
        "case_studies",
        "posts",
        "testimonials",
        "faqs",
        "seo",
        "enquiries",
        "media",
        "users",
    ]

    for collection in collections:

        data = read_collection(collection)

        if data is None:
            write_collection(collection, [])


    # Default homepage settings

    settings = read_collection("settings")

    if not settings:

        write_collection(
            "settings",
            [
                {
                    "id": "site",
                    "site_name": "Apexora Studio",
                    "created_at": now()
                }
            ]
        )
