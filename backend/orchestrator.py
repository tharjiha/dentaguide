import asyncio
from agents import habit_agent

async def run_pipeline(payload, profile: dict, history: list) -> dict:
    # Real habit agent — no API call needed
    habit_result = await habit_agent.run(payload, history)

    # Mocked risk + coach — no Claude call
    risk_result = {
        "severity": "medium",
        "flags": ["sustained sensitivity", "high sugar intake"],
        "explanation": "3 weeks of sensitivity combined with high sugar intake is an early cavity risk pattern. Consider reducing sugary drinks and booking a check-up."
    }

    coach_tip = "Try rinsing with warm salt water tonight — it reduces gum inflammation and is especially helpful if you're tracking gum disease."

    # Calculate dental score
    base = 60
    habit_bonus = habit_result["habit_score"] * 3
    risk_penalty = {"none": 0, "low": 5, "medium": 15, "high": 25}
    score = min(100, max(0, base + habit_bonus - risk_penalty.get(risk_result["severity"], 0)))

    alert = {
        "severity": risk_result["severity"],
        "flags": risk_result["flags"],
        "explanation": risk_result["explanation"]
    }

    return {
        "dental_score": score,
        "habit_score": habit_result["habit_score"],
        "streak": habit_result["streak"],
        "risk_severity": risk_result["severity"],
        "risk_flags": risk_result["flags"],
        "risk_explanation": risk_result["explanation"],
        "coach_tip": coach_tip,
        "alert": alert
    }