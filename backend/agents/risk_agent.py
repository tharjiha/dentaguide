import json
import httpx
from config import GEMINI_API_KEY

GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent"


async def run(payload, profile: dict, history: list) -> dict:
    conditions   = profile.get("conditions", [])
    genetic_risk = profile.get("genetic_risk", "none")

    recent = history[-14:] if len(history) >= 14 else history
    history_summary = [
        {
            "date":    c.get("created_at", ""),
            "symptoms": c.get("symptoms", []),
            "sugar":   c.get("sugar_intake", ""),
            "brushed": c.get("brushed", False),
            "flossed": c.get("flossed", False),
        }
        for c in recent
    ]

    prompt = f"""You are a dental risk screener. You are NOT a diagnostician.
Identify patterns in the data that correlate with known dental risk factors.

User's tracked conditions: {conditions}
Genetic risk flag: {genetic_risk}

Today's symptoms: {payload.symptoms}
Today's habits: brushed={payload.brushed}, flossed={payload.flossed}, sugar={payload.sugar_intake}

Last {len(recent)} days of history:
{json.dumps(history_summary, indent=2)}

Respond ONLY with a JSON object — no markdown, no code fences, no explanation outside the JSON:
{{
  "severity": "none" | "low" | "medium" | "high",
  "flags": ["short flag 1", "short flag 2"],
  "explanation": "plain English explanation a non-dentist can understand, max 2 sentences"
}}

Rules:
- Only flag when patterns are clear across multiple days
- Never use the word diagnosis
- Be conservative — false positives erode trust
- Consider genetic risk as a multiplier, not a standalone flag"""

    request_payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.1,
            "maxOutputTokens": 300,
            "thinkingConfig": {"thinkingBudget": 0},
        },
    }

    async with httpx.AsyncClient(timeout=20.0) as client:
        res = await client.post(
            f"{GEMINI_URL}?key={GEMINI_API_KEY}",
            json=request_payload,
        )

    if res.status_code == 429:
        print("[risk_agent] Rate limited — using fallback")
        return _fallback(payload, conditions)

    if res.status_code != 200:
        print(f"[risk_agent] Gemini error {res.status_code}: {res.text[:200]}")
        return _fallback(payload, conditions)

    try:
        data     = res.json()
        raw_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()

        # Strip markdown fences if present
        if raw_text.startswith("```"):
            raw_text = raw_text.split("```")[1]
            if raw_text.startswith("json"):
                raw_text = raw_text[4:]
            raw_text = raw_text.strip()

        return json.loads(raw_text)

    except Exception as e:
        print(f"[risk_agent] Parse error: {e}")
        return _fallback(payload, conditions)


def _fallback(payload, conditions: list) -> dict:
    """Rule-based fallback when Gemini is unavailable."""
    symptoms  = [s.lower() for s in (getattr(payload, "symptoms", []) or [])]
    sugar     = (getattr(payload, "sugar_intake", "Low") or "Low").title()
    brushed   = getattr(payload, "brushed", False)
    flossed   = getattr(payload, "flossed", False)

    HIGH_RISK = {"gum pain", "bleeding gums", "tooth pain"}
    WARN      = {"sensitivity", "dry mouth", "bad breath", "jaw pain"}

    high_syms = [s for s in symptoms if s in HIGH_RISK]
    warn_syms = [s for s in symptoms if s in WARN]

    flags = []
    if high_syms:
        flags.append(f"Symptoms: {', '.join(high_syms)}")
    if warn_syms:
        flags.append(f"Watch: {', '.join(warn_syms)}")
    if sugar == "High":
        flags.append("High sugar intake today")
    if not brushed:
        flags.append("No brushing logged today")
    if not flossed:
        flags.append("No flossing logged today")

    if high_syms and sugar == "High":
        severity    = "high"
        explanation = "Multiple risk indicators detected. A dental check-up is recommended."
    elif high_syms or (warn_syms and sugar == "High"):
        severity    = "medium"
        explanation = "A pattern worth monitoring has been detected. Consider a dental check-up if it persists."
    elif warn_syms or sugar == "High":
        severity    = "low"
        explanation = "Minor indicators noted. Maintain your current habits and monitor over the next few days."
    else:
        severity    = "none"
        flags       = []
        explanation = "No risk indicators today. Keep up the great habits."

    return {"severity": severity, "flags": flags, "explanation": explanation}