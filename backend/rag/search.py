import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.db import collection
from embeddings.embed import embed

def search(question: str, top_k: int = 5) -> list[dict]:
    """Embeds the question and performs a vector search in MongoDB."""
    query_vector = embed(question)
    if not query_vector:
        return []
        
    # Note: You must create a Vector Search Index in MongoDB Atlas named "default"
    # mapping the "embedding" field to a knnVector.
    pipeline = [
        {
            "$vectorSearch": {
                "index": "autoembed_index",
                "path": "embedding",
                "queryVector": query_vector,
                "numCandidates": 50,
                "limit": top_k
            }
        },
        {
            "$project": {
                "_id": 0,
                "url": 1,
                "title": 1,
                "content": 1,
                "score": { "$meta": "vectorSearchScore" }
            }
        }
    ]
    
    results = list(collection.aggregate(pipeline))
    return results
