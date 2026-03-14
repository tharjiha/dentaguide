async def run(payload, history: list) -> dict:
    brushed = payload.brushed
    flossed = payload.flossed
    mouthwash = payload.mouthwash
    sugar = payload.sugar_intake

    # Score out of 10
    score = 0
    if brushed: score += 4
    if flossed: score += 3
    if mouthwash: score += 1
    if sugar == "low": score += 2
    elif sugar == "medium": score += 1

    # Calculate streak from history
    streak = 0
    for checkin in reversed(history):
        if checkin.get("brushed"):
            streak += 1
        else:
            break

    return {
        "habit_score": score,
        "streak": streak,
        "summary": f"Brushed {'✓' if brushed else '✗'} · Floss {'✓' if flossed else '✗'} · Sugar: {sugar}"
    }