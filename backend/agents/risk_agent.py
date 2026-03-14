import anthropic
import json
from config import ANTHROPIC_API_KEY

client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

async def run(payload, profile: dict, history: list) -> dict:
    conditions = profile.get("conditions", [])
    genetic_risk = profile.get("genetic_risk", "none")

    # Build history summary — last 14 days
    recent = history[-14:] if len(history) >= 14 else history
    history_summary = []
    for c in recent:
        history_summary.append({
            "date": c.get("created_at", ""),
            "symptoms": c.get("symptoms", []),
            "sugar": c.get("sugar_intake", ""),
            "brushed": c.get("brushed", False),
            "flossed": c.get("flossed", False),
        })

    prompt = f"""
You are a dental risk screener. You are NOT a diagnostician.
Identify patterns in the data that correlate with known dental risk factors.

User's tracked conditions: {conditions}
Genetic risk flag: {genetic_risk}

Today's symptoms: {payload.symptoms}
Today's habits: brushed={payload.brushed}, flossed={payload.flossed}, sugar={payload.sugar_intake}

Last {len(recent)} days of history:
{json.dumps(history_summary, indent=2)}

Respond ONLY with a JSON object, no markdown, no explanation outside the JSON:
{{
  "severity": "none" | "low" | "medium" | "high",
  "flags": ["short flag 1", "short flag 2"],
  "explanation": "plain English explanation a non-dentist can understand, max 2 sentences"
}}

Rules:
- Only flag when patterns are clear across multiple days
- Never use the word diagnosis
- Be conservative — false positives erode trust
- Consider genetic risk as a multiplier, not a standalone flag
"""

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=300,
        messages=[{"role": "user", "content": prompt}]
    )

    text = response.content[0].text.strip()
    return json.loads(text)