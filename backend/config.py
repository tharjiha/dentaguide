from dotenv import load_dotenv
import os

load_dotenv()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_SERVICE_KEY")
RESEND_API_KEY = os.getenv("RESEND_API_KEY")
JWT_SECRET = os.getenv("JWT_SECRET")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
