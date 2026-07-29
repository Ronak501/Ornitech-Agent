import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

PROJECT_ID = os.getenv("GOOGLE_CLOUD_PROJECT")
LOCATION = os.getenv("GOOGLE_CLOUD_LOCATION", "us-central1")

# If Vertex AI project is configured, use Vertex AI. Otherwise fallback to Gemini API Key.
if PROJECT_ID:
    client = genai.Client(vertexai=True, project=PROJECT_ID, location=LOCATION)
else:
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
