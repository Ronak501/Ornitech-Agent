import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.gemini import client

def embed(text: str) -> list[float]:
    """Generates an embedding vector for the given text using Gemini."""
    try:
        response = client.models.embed_content(
            model="text-embedding-004",
            contents=text,
        )
        # response.embeddings[0].values contains the floats
        if response.embeddings:
             return response.embeddings[0].values
        return []
    except Exception as e:
        print(f"Error generating embedding: {e}")
        return []
