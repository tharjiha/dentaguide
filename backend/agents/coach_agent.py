import httpx
from config import GEMINI_API_KEY

GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent"


async def run(payload, profile: dict, risk_result: dict) -> str:
    conditions = profile.get("conditions", [])

    prompt = f"""You are a dental health coach giving one personalised tip.

User's tracked conditions: {conditions}
Today's habits: brushed={payload.brushed}, flossed={payload.flossed}, sugar={payload.sugar_intake}
Today's symptoms: {payload.symptoms}
Risk flags today: {risk_result.get("flags", [])}

Give exactly ONE specific, actionable tip. 2 sentences max.
Make it relevant to their actual conditions and today's data.
Do not give generic advice like "brush twice a day" if they already did.
Do not use the word diagnosis.
Respond with plain text only — no JSON, no bullet points."""

    request_payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.4,
            "maxOutputTokens": 150,
            "thinkingConfig": {"thinkingBudget": 0},
        },
    }

    async with httpx.AsyncClient(timeout=20.0) as client:
        res = await client.post(
            f"{GEMINI_URL}?key={GEMINI_API_KEY}",
            json=request_payload,
        )

    if res.status_code == 429:
        return _fallback_tip(payload, conditions, risk_result)

    if res.status_code != 200:
        print(f"[coach_agent] Gemini error {res.status_code}: {res.text[:200]}")
        return _fallback_tip(payload, conditions, risk_result)

    try:
        data = res.json()
        tip = data["candidates"][0]["content"]["parts"][0]["text"].strip()
        return tip
    except Exception as e:
        print(f"[coach_agent] Parse error: {e}")
        return _fallback_tip(payload, conditions, risk_result)


def _fallback_tip(payload, conditions: list, risk_result: dict) -> str:
    """Context-aware fallback when Gemini is unavailable."""
    flags = risk_result.get("flags", [])
    symptoms = list(getattr(payload, "symptoms", []) or [])
    sym_lower = {s.lower() for s in symptoms}

    if "Gum disease" in conditions and ("gum pain" in sym_lower or "bleeding gums" in sym_lower):
        return "Rinse with warm salt water tonight to reduce gum inflammation. Floss gently along the gumline — consistency here is the single biggest lever for gingivitis."
    if "Sensitivity" in conditions and "sensitivity" in sym_lower:
        return "Use a desensitising toothpaste for at least two weeks to see results. Avoid very hot or cold drinks today to give your enamel a break."
    if "Enamel erosion" in conditions and getattr(payload, "sugar_intake", "Low") == "High":
        return "Wait 30 minutes after sugary drinks before brushing — acid softens enamel temporarily and brushing too soon makes erosion worse. Rinse with water immediately after instead."
    if not getattr(payload, "flossed", False):
        return "Flossing removes up to 40% of the bacteria that brushing misses. Try keeping floss right next to your toothbrush so it becomes part of the same routine."
    if getattr(payload, "sugar_intake", "Low") == "High":
        return "High sugar feeds the bacteria that cause cavities. Try swapping one sugary drink for water tomorrow — small swaps compound over time."
    return "Every consistent habit you build now prevents costly treatment later. You're doing well — keep the streak going."