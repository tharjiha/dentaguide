"""
Habit Agent — scores today's habits and calculates the current streak.
No API call needed; pure logic based on the payload and check-in history.
"""

from datetime import datetime, timezone, timedelta


async def run(payload, history: list) -> dict:
    """
    Returns:
        habit_score (int 0-10): points for brushing, flossing, mouthwash, sugar
        streak (int): consecutive days with at least one habit logged
    """
    score = 0

    brushed   = getattr(payload, "brushed",   False) or False
    flossed   = getattr(payload, "flossed",   False) or False
    mouthwash = getattr(payload, "mouthwash", False) or False
    sugar     = (getattr(payload, "sugar_intake", "Low") or "Low").strip().title()

    if brushed:   score += 4   
    if flossed:   score += 3  
    if mouthwash: score += 2  

    if sugar == "Low":    score += 1
    elif sugar == "Med":  score += 0
    elif sugar == "High": score -= 1

    score = max(0, min(10, score))

    streak = _calculate_streak(history)

    return {
        "habit_score": score,
        "streak":      streak,
    }


def _calculate_streak(history: list) -> int:
    """
    Count consecutive days ending today (or yesterday) that have a check-in.
    Robust to multiple check-ins on the same day.
    """
    if not history:
        return 1  

    dates = set()
    for row in history:
        raw = row.get("created_at") or ""
        if not raw:
            continue
        try:
            raw = raw.replace("Z", "+00:00")
            dt  = datetime.fromisoformat(raw)
            dates.add(dt.date())
        except Exception:
            pass

    if not dates:
        return 1

    today = datetime.now(timezone.utc).date()
    dates.add(today)  

    streak = 0
    day    = today
    while day in dates:
        streak += 1
        day = day - timedelta(days=1)

    return streak