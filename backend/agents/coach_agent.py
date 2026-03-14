import anthropic
import json
from config import ANTHROPIC_API_KEY

client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

async def run(payload, profile: dict, risk_result: dict) -> str:
    conditions = profile.get("conditions", [])

    prompt = f"""
You are a dental health coach giving one personalised tip.

User's tracked conditions: {conditions}
Today's habits: brushed={payload.brushed}, flossed={payload.flossed}, sugar={payload.sugar_intake}
Today's symptoms: {payload.symptoms}
Risk flags today: {risk_result.get("flags", [])}

Give exactly ONE specific, actionable tip. 2 sentences max.
Make it relevant to their actual conditions and today's data.
Do not give generic advice like "brush twice a day" if they already did.
Do not use the word diagnosis.
Respond with plain text only — no JSON, no bullet points.
"""

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=150,
        messages=[{"role": "user", "content": prompt}]
    )

    return response.content[0].text.strip()