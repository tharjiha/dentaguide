from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from auth import get_current_user
from database import supabase
from models import ProfileCreate, CheckinPayload
from orchestrator import run_pipeline

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "DentaGuide API running"}

@app.post("/api/profile")
async def create_profile(
    profile: ProfileCreate,
    user_id: str = Depends(get_current_user)
):
    data = profile.model_dump()
    data["id"] = user_id
    result = supabase.table("profiles").upsert(data).execute()
    if not result.data:
        raise HTTPException(status_code=400, detail="Failed to save profile")
    return {"success": True, "profile": result.data[0]}

@app.get("/api/profile")
async def get_profile(user_id: str = Depends(get_current_user)):
    result = supabase.table("profiles").select("*").eq("id", user_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Profile not found")
    return result.data[0]

@app.post("/api/checkin")
async def submit_checkin(
    payload: CheckinPayload,
    user_id: str = Depends(get_current_user)
):
    profile = {
        "conditions": ["gum_disease", "sensitivity", "enamel_erosion"],
        "genetic_risk": "one parent",
        "chronic_conditions": []
    }

    history_result = supabase.table("check_ins") \
        .select("*") \
        .eq("user_id", user_id) \
        .order("created_at", desc=True) \
        .limit(30) \
        .execute()
    history = history_result.data or []

    results = await run_pipeline(payload, profile, history)

    import base64, uuid
    photo_url = None
    if payload.photo_base64:
        try:
            image_bytes = base64.b64decode(payload.photo_base64)
            filename = f"{user_id}/{uuid.uuid4()}.jpg"
            supabase.storage.from_("photos").upload(
                filename,
                image_bytes,
                {"content-type": "image/jpeg"}
            )
            photo_url = supabase.storage.from_("photos").get_public_url(filename)
            print(f"Photo saved: {photo_url}")
        except Exception as e:
            print(f"Photo upload failed: {e}")

    checkin_row = {
        "user_id": user_id,
        "brushed": payload.brushed,
        "flossed": payload.flossed,
        "mouthwash": payload.mouthwash,
        "sugar_intake": payload.sugar_intake,
        "symptoms": payload.symptoms,
        "habit_score": results["habit_score"],
        "streak": results["streak"],
        "risk_severity": results["risk_severity"],
        "risk_flags": results["risk_flags"],
        "risk_explanation": results["risk_explanation"],
        "coach_tip": results["coach_tip"],
        "dental_score": results["dental_score"],
        "photo_url": photo_url,
    }

    supabase.table("check_ins").insert(checkin_row).execute()

    if results["alert"]:
        supabase.table("risk_flags").insert({
            "user_id": user_id,
            "severity": results["risk_severity"],
            "flags": results["risk_flags"],
            "explanation": results["risk_explanation"]
        }).execute()

    return results

@app.get("/api/checkin/history")
async def get_history(user_id: str = Depends(get_current_user)):
    result = supabase.table("check_ins") \
        .select("*") \
        .eq("user_id", user_id) \
        .order("created_at", desc=True) \
        .limit(30) \
        .execute()
    return result.data or []

@app.get("/api/dashboard")
async def get_dashboard(user_id: str = Depends(get_current_user)):
    latest = supabase.table("check_ins") \
        .select("*") \
        .eq("user_id", user_id) \
        .order("created_at", desc=True) \
        .limit(1) \
        .execute()

    flags = supabase.table("risk_flags") \
        .select("*") \
        .eq("user_id", user_id) \
        .eq("resolved", False) \
        .order("created_at", desc=True) \
        .execute()

    history = supabase.table("check_ins") \
        .select("dental_score, created_at, symptoms, sugar_intake") \
        .eq("user_id", user_id) \
        .order("created_at", desc=True) \
        .limit(30) \
        .execute()

    return {
        "latest_checkin": latest.data[0] if latest.data else None,
        "active_alerts": flags.data or [],
        "history": history.data or []
    }