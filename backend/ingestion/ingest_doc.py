import sys
import os

# Ensure backend directory is in path for imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from ingestion.chunker import chunk_text
from embeddings.embed import embed
from app.db import collection

def ingest_text_file(filepath: str, title: str):
    print(f"Reading document: {filepath}")
    
    if not os.path.exists(filepath):
        print("File not found!")
        return

    text = ""
    if filepath.lower().endswith('.pdf'):
        try:
            import PyPDF2
            with open(filepath, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                for page in reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
        except ImportError:
            print("Please run: pip install PyPDF2")
            return
    else:
        with open(filepath, 'r', encoding='utf-8') as file:
            text = file.read()
            
    if not text.strip():
        print("No text could be extracted from this file.")
        return
    
    print(f"Chunking '{title}'...")
    chunks = chunk_text(text, chunk_size=200, overlap=50)
    
    documents = []
    print(f"Generating embeddings for {len(chunks)} chunks...")
    for i, chunk in enumerate(chunks):
        vector = embed(chunk)
        if vector:
            doc = {
                "url": filepath, # We use the filepath as a mock URL for reference
                "title": title,
                "content": chunk,
                "embedding": vector,
                "chunk_index": i
            }
            documents.append(doc)
            
    if documents:
        print(f"Inserting {len(documents)} chunks into MongoDB...")
        # Clear old documents from this file to avoid duplicates
        collection.delete_many({"url": filepath})
        collection.insert_many(documents)
        print("Document Ingestion complete!")
    else:
        print("No documents generated.")

if __name__ == "__main__":
    # Create a quick sample document if it doesn't exist
    sample_doc = r"C:\Users\RONAK\Downloads\Ornitech.pdf"
    if not os.path.exists(sample_doc):
        with open(sample_doc, "w", encoding="utf-8") as f:
            f.write(
                "Ornitech is a premier AI development agency. "
                "We specialize in building custom AI chatbots, RAG pipelines, and enterprise AI agents. "
                "You can contact us via email at hello@ornitech.in or call us at +91 9876543210. "
                "Our services include Cloud Deployment, Full-stack Web Development, and Next.js applications."
            )
        print(f"Created sample document: {sample_doc}")
    
    # Run the ingestion on the document
    ingest_text_file(sample_doc, "Ornitech Company Info")
