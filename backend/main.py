from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from routers import profile, auth, checkins
from auth import get_current_user
from db import get_supabase
from models import CheckinPayload

app = FastAPI(title="DentaGuide API", version="1.0.0")

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers (from HEAD branch) ────────────────────────────────────────────────
app.include_router(auth.router,     prefix="/api/auth",     tags=["auth"])
app.include_router(profile.router,  prefix="/api/profile",  tags=["profile"])
app.include_router(checkins.router, prefix="/api/checkins", tags=["checkins"])


# ── Health ────────────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "ok", "service": "DentaGuide API"}


# ── Check-in routes (from feat/daily-check-in branch) ────────────────────────

@app.post("/api/checkin")
async def submit_checkin(
    payload: CheckinPayload,
    user_id: str = Depends(get_current_user),
):
    """
    Original check-in endpoint from feat/daily-check-in.
    Runs the AI pipeline (orchestrator) and saves the result.
    """
    print(f"Received payload: {payload.model_dump()}")
    from orchestrator import run_pipeline

    sb = get_supabase()

    profile_res = sb.table("profiles").select("*").eq("user_id", user_id).execute()
    profile_data = profile_res.data[0] if profile_res.data else {}

    history_res = (
        sb.table("check_ins")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .limit(30)
        .execute()
    )
    history = history_res.data or []

    results = await run_pipeline(payload, profile_data, history)

    import base64, uuid
    photo_url = None
    if payload.photo_base64:
        print("Uploading photo...")

        try:
            image_bytes = base64.b64decode(payload.photo_base64)
            filename = f"{user_id}/{uuid.uuid4()}.jpg"

            sb.storage.from_("photos").upload(
                path=filename,
                file=image_bytes,
                file_options={"content-type": "image/jpeg"},
            )

            photo_url = sb.storage.from_("photos").get_public_url(filename)

            print("Photo uploaded:", photo_url)

        except Exception as e:
            print("Photo upload failed:", e)

    checkin_row = {
        "user_id":          user_id,
        "brushed":          payload.brushed,
        "flossed":          payload.flossed,
        "mouthwash":        payload.mouthwash,
        "sugar_intake":     payload.sugar_intake,
        "symptoms":         payload.symptoms,
        "habit_score":      results["habit_score"],
        "streak":           results["streak"],
        "risk_severity":    results["risk_severity"],
        "risk_flags":       results["risk_flags"],
        "risk_explanation": results["risk_explanation"],
        "coach_tip":        results["coach_tip"],
        "dental_score":     results["dental_score"],
        "photo_url":        photo_url,
    }
    print("Final photo_url:", photo_url)
    sb.table("check_ins").insert(checkin_row).execute()

    if results.get("alert"):
        sb.table("risk_flags").insert({
            "user_id":     user_id,
            "severity":    results["risk_severity"],
            "flags":       results["risk_flags"],
            "explanation": results["risk_explanation"],
        }).execute()

    return results


@app.get("/api/checkin/history")
async def get_checkin_history(user_id: str = Depends(get_current_user)):
    sb = get_supabase()
    res = (
        sb.table("check_ins")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .limit(30)
        .execute()
    )
    return res.data or []


@app.get("/api/dashboard")
async def get_dashboard(user_id: str = Depends(get_current_user)):
    sb = get_supabase()

    latest = (
        sb.table("check_ins").select("*")
        .eq("user_id", user_id).order("created_at", desc=True).limit(1).execute()
    )
    flags = (
        sb.table("risk_flags").select("*")
        .eq("user_id", user_id).eq("resolved", False).order("created_at", desc=True).execute()
    )
    history = (
        sb.table("check_ins")
        .select("dental_score, created_at, symptoms, sugar_intake")
        .eq("user_id", user_id).order("created_at", desc=True).limit(30).execute()
    )

    return {
        "latest_checkin": latest.data[0] if latest.data else None,
        "active_alerts":  flags.data or [],
        "history":        history.data or [],
    }