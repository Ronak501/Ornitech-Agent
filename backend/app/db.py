import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGODB_URL"))

db = client[os.getenv("DATABASE_NAME", "Ornitech")]
collection = db[os.getenv("COLLECTION_NAME", "knowledge_base")]
