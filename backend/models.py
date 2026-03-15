from __future__ import annotations
from typing import Optional
from pydantic import BaseModel, Field



class DentalBackground(BaseModel):
    age: int = Field(..., gt=0, lt=130)
    brushing_frequency: str
    flossing_frequency: str
    last_dentist_visit: str
    previous_treatments: Optional[str] = None



class ConditionsPayload(BaseModel):
    conditions: list[str] = Field(
        ...,
        description="List of condition labels the user selected or typed",
        examples=[["Gum disease", "Sensitivity"]],
    )



class HealthHistory(BaseModel):
    ongoing_issues:     Optional[str] = None
    medications:        Optional[str] = None
    allergies:          Optional[str] = None
    medical_procedures: Optional[str] = None
    dental_habits:      Optional[str] = None



class ProfileOut(BaseModel):
    user_id: str
    age:                 Optional[int]       = None
    brushing_frequency:  Optional[str]       = None
    flossing_frequency:  Optional[str]       = None
    last_dentist_visit:  Optional[str]       = None
    previous_treatments: Optional[str]       = None
    conditions:          Optional[list[str]] = None
    ongoing_issues:      Optional[str]       = None
    medications:         Optional[str]       = None
    allergies:           Optional[str]       = None
    medical_procedures:  Optional[str]       = None
    dental_habits:       Optional[str]       = None
    onboarding_complete: bool                = False



class ProfileCreate(BaseModel):
    full_name: str
    age: int
    last_dentist_visit: str
    brushing_frequency: str
    flossing_frequency: str
    mouthwash_frequency: str
    conditions: list[str]
    genetic_risk: str
    chronic_conditions: list[str]
    medications: Optional[str] = None



class CheckinPayload(BaseModel):
    brushed: bool
    flossed: bool
    mouthwash: bool
    sugar_intake: str
    symptoms: list[str]
    photo_base64: Optional[str] = None



class CheckinResponse(BaseModel):
    dental_score: int
    habit_score: int
    streak: int
    risk_severity: str
    risk_flags: list[str]
    risk_explanation: str
    coach_tip: str
    alert: Optional[dict] = None