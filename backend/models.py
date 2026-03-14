from __future__ import annotations
from typing import Optional
from pydantic import BaseModel, Field


# ── Step 1 — Dental background ────────────────────────────────────────────────

class DentalBackground(BaseModel):
    age: int = Field(..., gt=0, lt=130)
    brushing_frequency: str          # "Once a day" | "Twice a day" | "3+ times"
    flossing_frequency: str          # "Never" | "Rarely" | "A few times/week" | "Daily"
    last_dentist_visit: str
    previous_treatments: Optional[str] = None


# ── Step 2 — Conditions ───────────────────────────────────────────────────────

class ConditionsPayload(BaseModel):
    conditions: list[str] = Field(
        ...,
        description="List of condition labels the user selected or typed",
        examples=[["Gum disease", "Sensitivity"]],
    )


# ── Step 3 — Health history ───────────────────────────────────────────────────

class HealthHistory(BaseModel):
    ongoing_issues:     Optional[str] = None
    medications:        Optional[str] = None
    allergies:          Optional[str] = None
    medical_procedures: Optional[str] = None
    dental_habits:      Optional[str] = None


# ── Full profile (read) ───────────────────────────────────────────────────────

class ProfileOut(BaseModel):
    user_id: str
    age:                Optional[int]       = None
    brushing_frequency: Optional[str]       = None
    flossing_frequency: Optional[str]       = None
    last_dentist_visit: Optional[str]       = None
    previous_treatments:Optional[str]       = None
    conditions:         Optional[list[str]] = None
    ongoing_issues:     Optional[str]       = None
    medications:        Optional[str]       = None
    allergies:          Optional[str]       = None
    medical_procedures: Optional[str]       = None
    dental_habits:      Optional[str]       = None
    onboarding_complete: bool               = False