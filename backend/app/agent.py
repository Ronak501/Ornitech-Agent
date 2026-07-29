import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi import APIRouter
from pydantic import BaseModel
import logging
from rag.search import search
from app.gemini import client

router = APIRouter(prefix="/chat")

class ChatRequest(BaseModel):
    message: str

@router.post("/")
def chat(request: ChatRequest):
    logging.info(f"Received message: {request.message}")
    
    # 1. Embed question and search vector DB
    results = search(request.message, top_k=5)
    
    # 2. Build context from results
    context_text = ""
    for idx, r in enumerate(results):
        context_text += f"--- Source {idx+1}: {r['title']} ({r['url']}) ---\n{r['content']}\n\n"
    
    # 3. Ask Gemini
    system_instruction = (
        "You are the Ornitech AI Support & Search Agent. "
        "Answer the user's question based strictly on the provided context about Ornitech. "
        "If the answer is not in the context, politely say that you don't have that information. "
        "Do not hallucinate external facts."
    )
    
    prompt = f"Context:\n{context_text}\n\nUser Question: {request.message}"
    
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config={"system_instruction": system_instruction}
        )
        reply = response.text
    except Exception as e:
        logging.error(f"Error calling Gemini: {e}")
        reply = "Sorry, I am having trouble connecting to my brain right now."
        
    return {
        "reply": reply,
        "sources": [{"title": r['title'], "url": r['url']} for r in results]
    }
