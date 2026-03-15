from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from db import get_supabase
from models import DentalBackground, ConditionsPayload, HealthHistory, ProfileOut
import json

router = APIRouter()
bearer = HTTPBearer()


def get_current_user_id(
    creds: HTTPAuthorizationCredentials = Depends(bearer),
) -> str:
    """
    Verify the Bearer token with Supabase and return the authenticated user_id.
    Raises 401 if the token is missing, invalid, or expired.
    """
    sb = get_supabase()
    try:
        res = sb.auth.get_user(creds.credentials)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    if not res.user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return res.user.id



def _normalise(data: dict) -> dict:
    if isinstance(data.get("conditions"), str):
        data["conditions"] = json.loads(data["conditions"])
    return data


def _upsert(user_id: str, patch: dict) -> dict:
    sb = get_supabase()
    res = (
        sb.table("profiles")
        .upsert({"user_id": user_id, **patch}, on_conflict="user_id")
        .execute()
    )
    if not res.data:
        raise HTTPException(status_code=500, detail="Database write failed")
    return _normalise(res.data[0])



@router.get("/me", response_model=ProfileOut)
def get_my_profile(user_id: str = Depends(get_current_user_id)):
    sb = get_supabase()
    res = sb.table("profiles").select("*").eq("user_id", user_id).maybe_single().execute()
    if not res.data:
        return ProfileOut(user_id=user_id)
    return ProfileOut(**_normalise(res.data))



@router.post("/step1", response_model=ProfileOut, status_code=status.HTTP_200_OK)
def save_step1(payload: DentalBackground, user_id: str = Depends(get_current_user_id)):
    data = _upsert(user_id, {
        "age":                 payload.age,
        "brushing_frequency":  payload.brushing_frequency,
        "flossing_frequency":  payload.flossing_frequency,
        "last_dentist_visit":  payload.last_dentist_visit,
        "previous_treatments": payload.previous_treatments,
    })
    return ProfileOut(**data)



@router.post("/step2", response_model=ProfileOut, status_code=status.HTTP_200_OK)
def save_step2(payload: ConditionsPayload, user_id: str = Depends(get_current_user_id)):
    data = _upsert(user_id, {"conditions": payload.conditions})
    return ProfileOut(**data)



@router.post("/step3", response_model=ProfileOut, status_code=status.HTTP_200_OK)
def save_step3(payload: HealthHistory, user_id: str = Depends(get_current_user_id)):
    data = _upsert(user_id, {
        "ongoing_issues":      payload.ongoing_issues,
        "medications":         payload.medications,
        "allergies":           payload.allergies,
        "medical_procedures":  payload.medical_procedures,
        "dental_habits":       payload.dental_habits,
        "onboarding_complete": True,
    })
    return ProfileOut(**data)



@router.patch("/me", response_model=ProfileOut)
def update_my_profile(patch: dict, user_id: str = Depends(get_current_user_id)):
    if not patch:
        raise HTTPException(status_code=400, detail="No fields provided")
    data = _upsert(user_id, patch)
    return ProfileOut(**data)
