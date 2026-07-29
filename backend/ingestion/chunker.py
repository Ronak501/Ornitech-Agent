def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 200) -> list[str]:
    """Splits text into chunks of a maximum size, with overlap."""
    words = text.split()
    chunks = []
    
    # Simple word-based chunking
    i = 0
    while i < len(words):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)
        i += (chunk_size - overlap)
        
    return chunks
