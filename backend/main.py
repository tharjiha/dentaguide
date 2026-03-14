from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import profile, auth

app = FastAPI(title="DentaGuide API", version="1.0.0")

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],   # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth.router,    prefix="/api/auth",    tags=["auth"])
app.include_router(profile.router, prefix="/api/profile", tags=["profile"])


@app.get("/")
def health():
    return {"status": "ok", "service": "DentaGuide API"}