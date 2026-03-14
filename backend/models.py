from pydantic import BaseModel
from typing import Optional

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