import sys
import os

# Ensure backend directory is in path for imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from crawler.crawl import crawl_url
from ingestion.chunker import chunk_text
from embeddings.embed import embed
from app.db import collection

def ingest_url(url: str):
    print(f"Crawling {url}...")
    page_data = crawl_url(url)
    if not page_data or not page_data['content']:
        print(f"Failed to extract content from {url}")
        return

    text = page_data['content']
    title = page_data['title']
    
    print(f"Chunking '{title}'...")
    # 200 words per chunk for better embedding resolution
    chunks = chunk_text(text, chunk_size=200, overlap=50)
    
    documents = []
    print(f"Generating embeddings for {len(chunks)} chunks...")
    for i, chunk in enumerate(chunks):
        vector = embed(chunk)
        if vector:
            doc = {
                "url": url,
                "title": title,
                "content": chunk,
                "embedding": vector,
                "chunk_index": i
            }
            documents.append(doc)
            
    if documents:
        print(f"Inserting {len(documents)} chunks into MongoDB...")
        # Clear old documents for this URL to avoid duplicates during testing
        collection.delete_many({"url": url})
        collection.insert_many(documents)
        print("Ingestion complete!")
    else:
        print("No documents generated.")

if __name__ == "__main__":
    test_urls = [
        "https://ornitech.in/",
        "https://www.ornitech.in/about",
        "https://www.ornitech.in/contact"
        # Add more Ornitech URLs here
    ]
    for url in test_urls:
        ingest_url(url)
