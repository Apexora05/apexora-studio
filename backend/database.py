import json
from pathlib import Path

DATA_DIR = Path("data")
DATA_DIR.mkdir(exist_ok=True)


def _file(name):
    return DATA_DIR / f"{name}.json"


def read_collection(name):
    f = _file(name)
    if not f.exists():
        f.write_text("[]", encoding="utf-8")
        return []

    try:
        return json.loads(f.read_text(encoding="utf-8"))
    except:
        return []


def write_collection(name, data):
    _file(name).write_text(
        json.dumps(data, indent=2),
        encoding="utf-8"
    )


class JsonCollection:

    def __init__(self, name):
        self.name = name

    async def find_one(self, query=None):
        docs = read_collection(self.name)

        if not query:
            return docs[0] if docs else None

        for doc in docs:
            ok = True
            for k, v in query.items():
                if doc.get(k) != v:
                    ok = False
                    break

            if ok:
                return doc

        return None

    async def insert_one(self, doc):
        docs = read_collection(self.name)
        docs.append(doc)
        write_collection(self.name, docs)

    async def update_one(self, query, update, upsert=False):

        docs = read_collection(self.name)

        updated = False

        for i, doc in enumerate(docs):

            ok = True

            for k, v in query.items():
                if doc.get(k) != v:
                    ok = False

            if ok:
                doc.update(update.get("$set", {}))
                docs[i] = doc
                updated = True
                break

        if not updated and upsert:
            doc = update.get("$set", {})
            docs.append(doc)

        write_collection(self.name, docs)

    async def delete_one(self, query):

        docs = read_collection(self.name)

        docs = [
            d
            for d in docs
            if not all(d.get(k) == v for k, v in query.items())
        ]

        write_collection(self.name, docs)

    async def find(self, query=None):

        docs = read_collection(self.name)

        if not query:
            return docs

        result = []

        for doc in docs:

            ok = True

            for k, v in query.items():
                if doc.get(k) != v:
                    ok = False

            if ok:
                result.append(doc)

        return result

    async def count_documents(self, query=None):
        return len(await self.find(query))


class Database:
    settings = JsonCollection("settings")
    pages = JsonCollection("pages")
    services = JsonCollection("services")
    portfolio = JsonCollection("portfolio")
    case_studies = JsonCollection("case_studies")
    posts = JsonCollection("posts")
    testimonials = JsonCollection("testimonials")
    faqs = JsonCollection("faqs")
    enquiries = JsonCollection("enquiries")
    media = JsonCollection("media")
    users = JsonCollection("users")
    seo = JsonCollection("seo")
    login_attempts = JsonCollection("login_attempts")
    password_reset_tokens = JsonCollection("password_reset_tokens")


db = Database()


async def create_indexes():
    return
