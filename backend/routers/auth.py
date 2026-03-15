from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from db import get_supabase

router = APIRouter()

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


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(body: RegisterRequest):
    """
    Create a new Supabase Auth user and seed an empty profiles row.
    Returns the session (access_token + refresh_token) on success.
    """
    sb = get_supabase()
    try:
        res = sb.auth.sign_up({
            "email": body.email,
            "password": body.password,
            "options": {
                "data": {
                    "first_name": body.first_name,
                    "last_name": body.last_name,
                }
            },
        })
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    if not res.user:
        raise HTTPException(status_code=400, detail="Registration failed")

    user_id = res.user.id
    sb.table("profiles").upsert(
        {"user_id": user_id, "onboarding_complete": False},
        on_conflict="user_id",
    ).execute()

    return {
        "user": {
            "id": user_id,
            "email": res.user.email,
            "first_name": body.first_name,
            "last_name": body.last_name,
        },
        "access_token": res.session.access_token if res.session else None,
        "refresh_token": res.session.refresh_token if res.session else None,
    }


@router.post("/login")
def login(body: LoginRequest):
    """
    Sign in with email + password.
    Returns session tokens and basic user info.
    """
    sb = get_supabase()

    try:
        res = sb.auth.sign_in_with_password({
            "email": body.email,
            "password": body.password,
        })
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not res.user or not res.session:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    meta = res.user.user_metadata or {}

    return {
        "user": {
            "id": res.user.id,
            "email": res.user.email,
            "first_name": meta.get("first_name", ""),
            "last_name": meta.get("last_name", ""),
        },
        "access_token": res.session.access_token,
        "refresh_token": res.session.refresh_token,
    }


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(body: TokenRequest):
    """Invalidate the user's session on the Supabase side."""
    sb = get_supabase()
    try:
        sb.auth.admin.sign_out(body.access_token)
    except Exception:
        pass   
    return None


@router.get("/me")
def get_me(body: TokenRequest):
    """
    Verify an access token and return the current user.
    The frontend calls this on page load to restore the session.
    """
    sb = get_supabase()
    try:
        res = sb.auth.get_user(body.access_token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    if not res.user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    meta = res.user.user_metadata or {}
    return {
        "id": res.user.id,
        "email": res.user.email,
        "first_name": meta.get("first_name", ""),
        "last_name": meta.get("last_name", ""),
    }
