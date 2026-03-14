from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from db import get_supabase
from datetime import datetime, timedelta, timezone
import json

router = APIRouter()
bearer = HTTPBearer()


def get_current_user_id(
    creds: HTTPAuthorizationCredentials = Depends(bearer),
) -> str:
    sb = get_supabase()
    try:
        res = sb.auth.get_user(creds.credentials)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    if not res.user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return res.user.id


def _normalise(row: dict) -> dict:
    """Ensure array fields are lists, not raw strings."""
    for field in ("symptoms", "risk_flags"):
        val = row.get(field)
        if isinstance(val, str):
            try:
                row[field] = json.loads(val)
            except Exception:
                row[field] = []
        elif val is None:
            row[field] = []
    return row


# ── GET /api/checkins/trends ──────────────────────────────────────────────────

@router.get("/trends")
def get_trends(
    days: int = 30,
    user_id: str = Depends(get_current_user_id),
):
    """
    Compute trend metrics from the user's existing check_ins rows.
    Maps to your actual schema:
      brushed, flossed, mouthwash, sugar_intake, symptoms, habit_score,
      streak, risk_severity, risk_flags, risk_explanation, coach_tip,
      dental_score, created_at
    """
    sb = get_supabase()
    since = (datetime.now(timezone.utc) - timedelta(days=days)).isoformat()

    res = (
        sb.table("check_ins")
        .select(
            "id,brushed,flossed,mouthwash,sugar_intake,symptoms,"
            "habit_score,streak,risk_severity,risk_flags,risk_explanation,"
            "coach_tip,dental_score,created_at"
        )
        .eq("user_id", user_id)
        .gte("created_at", since)
        .order("created_at", desc=False)
        .execute()
    )

    rows = [_normalise(r) for r in (res.data or [])]

    if not rows:
        return {
            "total_checkins":    0,
            "brush_rate":        0,
            "floss_rate":        0,
            "mouthwash_rate":    0,
            "high_sugar_days":   0,
            "avg_habit_score":   0,
            "avg_dental_score":  0,
            "latest_streak":     0,
            "symptom_frequency": {},
            "risk_breakdown":    {"none": 0, "low": 0, "medium": 0, "high": 0},
            "daily":             [],
        }

    total = len(rows)

    brush_rate     = round(sum(1 for r in rows if r.get("brushed"))    / total * 100)
    floss_rate     = round(sum(1 for r in rows if r.get("flossed"))    / total * 100)
    mouthwash_rate = round(sum(1 for r in rows if r.get("mouthwash"))  / total * 100)
    high_sugar     = sum(1 for r in rows if r.get("sugar_intake") == "High")

    habit_scores  = [r["habit_score"]  for r in rows if r.get("habit_score")  is not None]
    dental_scores = [r["dental_score"] for r in rows if r.get("dental_score") is not None]
    avg_habit   = round(sum(habit_scores)  / len(habit_scores),  1) if habit_scores  else 0
    avg_dental  = round(sum(dental_scores) / len(dental_scores), 1) if dental_scores else 0

    # Latest streak value (most recent row)
    latest_streak = rows[-1].get("streak") or 0

    # Symptom frequency (% of check-ins where symptom appeared)
    symptom_counts: dict[str, int] = {}
    for r in rows:
        for s in r.get("symptoms") or []:
            symptom_counts[s] = symptom_counts.get(s, 0) + 1
    symptom_freq = {
        k: round(v / total * 100)
        for k, v in sorted(symptom_counts.items(), key=lambda x: -x[1])
    }

    # Risk breakdown using risk_severity
    risk_breakdown = {"none": 0, "low": 0, "medium": 0, "high": 0}
    for r in rows:
        level = (r.get("risk_severity") or "none").lower()
        if level not in risk_breakdown:
            level = "none"
        risk_breakdown[level] += 1

    # Daily rows for charts — include date label from created_at
    daily = []
    for r in rows:
        created = r.get("created_at", "")
        date_label = created[:10] if created else ""
        daily.append({
            "date":          date_label,
            "brushed":       r.get("brushed", False),
            "flossed":       r.get("flossed", False),
            "mouthwash":     r.get("mouthwash", False),
            "sugar_intake":  r.get("sugar_intake", "Low"),
            "symptoms":      r.get("symptoms") or [],
            "risk_severity": (r.get("risk_severity") or "none").lower(),
            "habit_score":   r.get("habit_score"),
            "dental_score":  r.get("dental_score"),
            "coach_tip":     r.get("coach_tip"),
        })

    return {
        "total_checkins":    total,
        "brush_rate":        brush_rate,
        "floss_rate":        floss_rate,
        "mouthwash_rate":    mouthwash_rate,
        "high_sugar_days":   high_sugar,
        "avg_habit_score":   avg_habit,
        "avg_dental_score":  avg_dental,
        "latest_streak":     latest_streak,
        "symptom_frequency": symptom_freq,
        "risk_breakdown":    risk_breakdown,
        "daily":             daily,
    }


# ── GET /api/checkins/today ───────────────────────────────────────────────────

@router.get("/today")
def get_today(user_id: str = Depends(get_current_user_id)):
    """Return the most recent check-in from today (UTC)."""
    sb = get_supabase()
    today_start = datetime.now(timezone.utc).replace(
        hour=0, minute=0, second=0, microsecond=0
    ).isoformat()

    res = (
        sb.table("check_ins")
        .select("*")
        .eq("user_id", user_id)
        .gte("created_at", today_start)
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )
    if not res.data:
        return None
    return _normalise(res.data[0])


# ── GET /api/checkins/history ─────────────────────────────────────────────────

@router.get("/history")
def get_history(
    days: int = 30,
    user_id: str = Depends(get_current_user_id),
):
    sb = get_supabase()
    since = (datetime.now(timezone.utc) - timedelta(days=days)).isoformat()
    res = (
        sb.table("check_ins")
        .select("*")
        .eq("user_id", user_id)
        .gte("created_at", since)
        .order("created_at", desc=False)
        .execute()
    )
    return [_normalise(r) for r in (res.data or [])]