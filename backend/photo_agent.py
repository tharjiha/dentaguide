import os
import json
import asyncio
import httpx
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Models tried in order — falls back if one is rate-limited or unavailable
GEMINI_MODELS = [
    "gemini-3.1-flash-lite-preview",   # preferred — fastest, cost-efficient, multimodal
    "gemini-1.5-flash-latest",          # fallback if quota exhausted
    "gemini-1.5-flash-8b",              # last resort
]

def _model_url(model: str) -> str:
    return f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"


def build_user_context(profile: dict, history: list, payload) -> str:
    lines = []

    conditions = profile.get("conditions") or []
    if conditions:
        lines.append(f"Tracked dental conditions: {', '.join(conditions)}.")
    if profile.get("brushing_frequency"):
        lines.append(f"Brushing frequency: {profile['brushing_frequency']}.")
    if profile.get("flossing_frequency"):
        lines.append(f"Flossing frequency: {profile['flossing_frequency']}.")
    if profile.get("last_dentist_visit"):
        lines.append(f"Last dentist visit: {profile['last_dentist_visit']}.")
    if profile.get("previous_treatments"):
        lines.append(f"Previous dental treatments: {profile['previous_treatments']}.")
    if profile.get("medications"):
        lines.append(f"Current medications: {profile['medications']}.")
    if profile.get("ongoing_issues"):
        lines.append(f"Ongoing dental issues: {profile['ongoing_issues']}.")
    if profile.get("dental_habits"):
        lines.append(f"Habits affecting dental health: {profile['dental_habits']}.")

    symptoms = list(getattr(payload, "symptoms", []) or [])
    if symptoms:
        lines.append(f"Symptoms reported today: {', '.join(symptoms)}.")

    habit_parts = []
    if getattr(payload, "brushed",   False): habit_parts.append("brushed")
    if getattr(payload, "flossed",   False): habit_parts.append("flossed")
    if getattr(payload, "mouthwash", False): habit_parts.append("used mouthwash")
    sugar = getattr(payload, "sugar_intake", "Low")
    habit_parts.append(f"sugar intake: {sugar}")
    lines.append(f"Today's habits: {', '.join(habit_parts)}.")

    recent = history[:14]
    if recent:
        high_sugar_days = sum(1 for r in recent if (r.get("sugar_intake") or "").title() == "High")
        all_symptoms    = [s for r in recent for s in (r.get("symptoms") or [])]
        freq: dict[str, int] = {}
        for s in all_symptoms:
            freq[s] = freq.get(s, 0) + 1
        common = sorted(freq.items(), key=lambda x: -x[1])[:3]
        if high_sugar_days:
            lines.append(f"Recent pattern: high sugar on {high_sugar_days} of last {len(recent)} days.")
        if common:
            lines.append(f"Most frequent recent symptoms: {', '.join(f'{s} ({n}x)' for s, n in common)}.")

    return " ".join(lines) if lines else "No prior dental history available."


def build_prompt(user_context: str) -> str:
    return f"""You are a dental health screening assistant. Analyze this photo of teeth submitted through a personal dental tracking app.

USER DENTAL PROFILE:
{user_context}

Use this context to make your analysis more relevant:
- If the user tracks gum disease, closely examine gumline colour, redness, swelling, recession
- If they report sensitivity, look for signs of enamel wear or exposed dentine
- If they have high sugar intake, look for early decay, plaque, or discolouration
- If they report ongoing issues, look for visual correlates

Be HONEST and THOROUGH. 

Respond ONLY in this exact JSON format with no other text:
{{
  "visible_observations": ["Specific observation 1", "Specific observation 2"],
  "areas_of_concern": ["Specific concern with location, e.g. gumline redness lower front teeth"],
  "positive_signs": ["Any healthy signs visible"],
  "context_matched_findings": ["Findings relevant to the user's known conditions or symptoms"],
  "photo_quality": "good",
  "photo_quality_note": null,
  "overall_visual_impression": "healthy",
  "summary": "2-3 sentence honest summary referencing user context where relevant",
  "recommended_action": "none"
}}

For overall_visual_impression use exactly: "healthy", "mild_concerns", "notable_concerns", or "significant_concerns"
For recommended_action use exactly: "none", "monitor", "mention_to_dentist", or "see_dentist_soon"
For photo_quality use exactly: "good", "acceptable", or "poor"

Be specific — mention tooth colour, gum colour, visible plaque or tartar, recession, staining, crowding, or any irregularities. If this is not a photo of teeth, say so clearly in the summary."""


async def _call_gemini(model: str, request_payload: dict) -> dict:
    """Make one Gemini API call and return the parsed response."""
    url = _model_url(model)
    async with httpx.AsyncClient(timeout=30.0) as client:
        res = await client.post(
            f"{url}?key={GEMINI_API_KEY}",
            json=request_payload,
        )
    return res


async def analyze_photo(photo_base64: str, profile: dict = None, history: list = None, payload=None) -> dict:
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is not set in your .env file")

    user_context = build_user_context(profile or {}, history or [], payload)
    prompt       = build_prompt(user_context)

    request_payload = {
        "contents": [{
            "parts": [
                {"text": prompt},
                {"inline_data": {"mime_type": "image/jpeg", "data": photo_base64}},
            ]
        }],
        "generationConfig": {
            "temperature": 0.1,
            "topP": 0.8,
            "maxOutputTokens": 1024,
            "thinkingConfig": {
                "thinkingBudget": 0  # disable thinking for fast photo analysis
            }
        },
    }

    last_error = None

    # Try each model in order, with one retry on 429
    for model in GEMINI_MODELS:
        for attempt in range(2):  # 2 attempts per model
            try:
                print(f"[photo_agent] Trying model={model} attempt={attempt+1}")
                res = await _call_gemini(model, request_payload)
                print(f"[photo_agent] Status: {res.status_code}")

                if res.status_code == 429:
                    data = res.json()
                    # Extract retry delay if provided
                    retry_delay = 30
                    try:
                        details = data.get("error", {}).get("details", [])
                        for d in details:
                            if d.get("@type", "").endswith("RetryInfo"):
                                delay_str = d.get("retryDelay", "30s")
                                retry_delay = int(delay_str.replace("s", "").strip()) + 2
                    except Exception:
                        pass

                    if attempt == 0:
                        print(f"[photo_agent] Rate limited on {model}, waiting {retry_delay}s...")
                        await asyncio.sleep(retry_delay)
                        continue
                    else:
                        last_error = f"Rate limited on {model}"
                        print(f"[photo_agent] Still rate limited after retry, trying next model")
                        break  # Try next model

                if res.status_code != 200:
                    last_error = f"HTTP {res.status_code}: {res.text[:200]}"
                    print(f"[photo_agent] Error: {last_error}")
                    break  # Try next model

                # Success — parse response
                data = res.json()
                raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
                print(f"[photo_agent] Success with {model}. Raw: {raw_text[:200]}...")

                clean = raw_text.strip()
                if clean.startswith("```"):
                    clean = clean.split("```")[1]
                    if clean.startswith("json"):
                        clean = clean[4:]
                    clean = clean.strip()

                analysis = json.loads(clean)
                print(f"[photo_agent] Impression: {analysis.get('overall_visual_impression')}")
                return analysis

            except json.JSONDecodeError as e:
                print(f"[photo_agent] JSON parse error on {model}: {e}")
                last_error = f"JSON parse error: {e}"
                break  # Bad response from this model, try next
            except Exception as e:
                print(f"[photo_agent] Exception on {model} attempt {attempt+1}: {e}")
                last_error = str(e)
                if attempt == 0:
                    await asyncio.sleep(2)
                    continue
                break

    # All models failed
    raise ValueError(f"All Gemini models failed. Last error: {last_error}")


def impression_to_risk(impression: str) -> str:
    return {
        "healthy":               "none",
        "mild_concerns":         "low",
        "notable_concerns":      "medium",
        "significant_concerns":  "high",
    }.get(impression, "none")


def recommended_action_to_risk(action: str) -> str:
    return {
        "none":               "none",
        "monitor":            "low",
        "mention_to_dentist": "medium",
        "see_dentist_soon":   "high",
    }.get(action, "none")