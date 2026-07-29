from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.agent import router as chat_router

app = FastAPI(title="Ornitech AI Agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)

@app.get("/")
def root():
    return {"message": "Ornitech AI Agent API is running"}
