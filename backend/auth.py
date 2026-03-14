from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from db import get_supabase

router = APIRouter()
bearer = HTTPBearer()


# ── Shared auth dependency (used by checkin routes from feat/daily-check-in) ──

def get_current_user(
    creds: HTTPAuthorizationCredentials = Depends(bearer),
) -> str:
    """Verify Bearer token and return user_id. Used across all protected routes."""
    sb = get_supabase()
    try:
        res = sb.auth.get_user(creds.credentials)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    if not res.user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return res.user.id


# ── Request models ────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenRequest(BaseModel):
    access_token: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    access_token: str
    new_password: str


# ── POST /api/auth/register ───────────────────────────────────────────────────

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(body: RegisterRequest):
    sb = get_supabase()
    try:
        res = sb.auth.sign_up({
            "email": body.email,
            "password": body.password,
            "options": {
                "data": {
                    "first_name": body.first_name,
                    "last_name":  body.last_name,
                }
            },
        })
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    if not res.user:
        raise HTTPException(status_code=400, detail="Registration failed")

    if not res.session:
        raise HTTPException(
            status_code=400,
            detail="Email confirmation is enabled in Supabase. "
                   "Disable it: Authentication → Providers → Email → turn off 'Confirm email'."
        )

    user_id = res.user.id

    try:
        sb.table("profiles").upsert(
            {"user_id": user_id, "onboarding_complete": False},
            on_conflict="user_id",
        ).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Profile seed failed: {str(e)}")

    return {
        "user": {
            "id":         user_id,
            "email":      res.user.email,
            "first_name": body.first_name,
            "last_name":  body.last_name,
        },
        "access_token":  res.session.access_token,
        "refresh_token": res.session.refresh_token,
    }


# ── POST /api/auth/login ──────────────────────────────────────────────────────

@router.post("/login")
def login(body: LoginRequest):
    sb = get_supabase()
    try:
        res = sb.auth.sign_in_with_password({
            "email":    body.email,
            "password": body.password,
        })
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not res.user or not res.session:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    meta = res.user.user_metadata or {}
    return {
        "user": {
            "id":         res.user.id,
            "email":      res.user.email,
            "first_name": meta.get("first_name", ""),
            "last_name":  meta.get("last_name",  ""),
        },
        "access_token":  res.session.access_token,
        "refresh_token": res.session.refresh_token,
    }


# ── POST /api/auth/logout ─────────────────────────────────────────────────────

@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(body: TokenRequest):
    sb = get_supabase()
    try:
        sb.auth.admin.sign_out(body.access_token)
    except Exception:
        pass
    return None


# ── POST /api/auth/me ─────────────────────────────────────────────────────────

@router.post("/me")
def get_me(body: TokenRequest):
    sb = get_supabase()
    try:
        res = sb.auth.get_user(body.access_token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    if not res.user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    meta = res.user.user_metadata or {}
    return {
        "id":         res.user.id,
        "email":      res.user.email,
        "first_name": meta.get("first_name", ""),
        "last_name":  meta.get("last_name",  ""),
    }


# ── POST /api/auth/forgot-password ───────────────────────────────────────────

@router.post("/forgot-password", status_code=status.HTTP_200_OK)
def forgot_password(body: ForgotPasswordRequest):
    sb = get_supabase()
    try:
        sb.auth.reset_password_email(
            body.email,
            options={"redirect_to": "http://localhost:5173/reset-password"},
        )
    except Exception:
        pass
    return {"message": "If that email exists, a reset link has been sent."}


# ── POST /api/auth/reset-password ────────────────────────────────────────────

@router.post("/reset-password", status_code=status.HTTP_200_OK)
def reset_password(body: ResetPasswordRequest):
    sb = get_supabase()
    try:
        user = sb.auth.get_user(body.access_token).user
        sb.auth.admin.update_user_by_id(user.id, {"password": body.new_password})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    return {"message": "Password updated successfully"}