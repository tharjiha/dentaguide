import asyncio
from agents import habit_agent, risk_agent
from photo_agent import analyze_photo, impression_to_risk, recommended_action_to_risk


async def run_pipeline(payload, profile: dict, history: list) -> dict:
    """
    Run all agents. Photo agent now receives full user context.
    """

    has_photo = bool(getattr(payload, "photo_base64", None))
    tasks = [
        habit_agent.run(payload, history),
        risk_agent.run(payload, profile, history),
    ]
    photo_task_idx = None
    if has_photo:
        photo_task_idx = len(tasks)
        tasks.append(
            analyze_photo(
                photo_base64=payload.photo_base64,
                profile=profile,
                history=history,
                payload=payload,
            )
        )

    results = await asyncio.gather(*tasks, return_exceptions=True)

    habit_result = results[0] if not isinstance(results[0], Exception) else {
        "habit_score": 5, "streak": 0
    }

    _risk_agent_result = results[1] if not isinstance(results[1], Exception) else None

    photo_analysis = None
    photo_error    = None
    if has_photo and photo_task_idx is not None:
        if isinstance(results[photo_task_idx], Exception):
            photo_error = str(results[photo_task_idx])
            print(f"Photo analysis failed: {photo_error}")
        else:
            photo_analysis = results[photo_task_idx]

    risk_result = _risk_agent_result or await risk_agent.run(payload, profile, history)

    risk_severity   = risk_result.get("severity", "none")
    risk_flags      = risk_result.get("flags", [])
    risk_explanation = risk_result.get("explanation", "")

    risk_order = ["none", "low", "medium", "high"]
    photo_risk = "none"
    if photo_analysis:
        photo_risk  = impression_to_risk(photo_analysis.get("overall_visual_impression", "healthy"))
        action_risk = recommended_action_to_risk(photo_analysis.get("recommended_action", "none"))
        photo_risk  = risk_order[max(risk_order.index(photo_risk), risk_order.index(action_risk))]

        if risk_order.index(photo_risk) > risk_order.index(risk_severity):
            risk_severity    = photo_risk
            risk_explanation = "Multiple risk indicators detected today. A professional dental assessment is recommended."

        for concern in (photo_analysis.get("areas_of_concern") or []):
            risk_flags.append(f"Photo: {concern}")
        for finding in (photo_analysis.get("context_matched_findings") or []):
            risk_flags.append(f"Context: {finding}")

    symptoms   = list(payload.symptoms or [])
    sugar      = getattr(payload, "sugar_intake", "Low")
    conditions = profile.get("conditions") or []
    sym_lower  = {s.lower() for s in symptoms}

    brushed   = getattr(payload, "brushed",   False)
    flossed   = getattr(payload, "flossed",   False)
    mouthwash = getattr(payload, "mouthwash", False)

    context_findings = (photo_analysis or {}).get("context_matched_findings") or []
    areas_of_concern = (photo_analysis or {}).get("areas_of_concern") or []

    if context_findings:
        finding = context_findings[0].lower()
        if "gum" in finding or "bleed" in finding or "gingivitis" in finding:
            coach_tip = (
                f"Your photo analysis found something consistent with your tracked gum condition: "
                f"{context_findings[0]}. Rinse with warm salt water tonight and ensure you're "
                "flossing gently along the gumline daily."
            )
        elif "enamel" in finding or "erosion" in finding or "wear" in finding:
            coach_tip = (
                f"The photo screening noted {context_findings[0]}, consistent with your enamel tracking. "
                "Wait 30 minutes after acidic foods before brushing, and consider a fluoride toothpaste."
            )
        elif "sensitivity" in finding or "recession" in finding:
            coach_tip = (
                f"Photo finding: {context_findings[0]}. For sensitivity, use a soft-bristled brush "
                "and desensitising toothpaste. Avoid brushing immediately after acidic foods or drinks."
            )
        elif "plaque" in finding or "buildup" in finding or "tartar" in finding:
            coach_tip = (
                f"Photo shows {context_findings[0]}, which matches your history. "
                "Brush at a 45° angle to the gumline and consider an electric toothbrush for better coverage."
            )
        else:
            coach_tip = (
                f"Your photo screening noted: {context_findings[0]}. "
                "Your dentist can assess this in more detail at your next visit."
            )
    elif areas_of_concern:
        concern = areas_of_concern[0].lower()
        if "gum" in concern or "bleed" in concern:
            coach_tip = "Your photo shows possible gum irritation. Rinse with warm salt water tonight and floss gently along the gumline."
        elif "plaque" in concern or "buildup" in concern:
            coach_tip = "Your photo shows some buildup. Brush at a 45° angle to the gumline and consider an electric toothbrush."
        elif "discolour" in concern or "stain" in concern or "yellow" in concern:
            coach_tip = "Some discolouration is visible. Reducing coffee, tea, and sugary drinks helps. A professional cleaning would address this effectively."
        else:
            coach_tip = f"Photo screening noted: {areas_of_concern[0]}. Your dentist can assess this at your next visit."
    elif "Gum disease" in conditions and ("gum pain" in sym_lower or "bleeding gums" in sym_lower):
        coach_tip = "Given your gum disease tracking and today's symptoms, rinse with warm salt water tonight to reduce inflammation."
    elif "Sensitivity" in conditions and "sensitivity" in sym_lower:
        coach_tip = "For sensitivity, use desensitising toothpaste for at least 2 weeks. Avoid very hot or cold drinks today."
    elif "Enamel erosion" in conditions and sugar == "High":
        coach_tip = "High sugar today accelerates enamel wear. Rinse with water after sugary drinks — wait 30 minutes before brushing."
    elif not flossed:
        coach_tip = "Flossing removes up to 40% of bacteria brushing misses. Try keeping floss next to your toothbrush."
    elif sugar == "High":
        coach_tip = "High sugar feeds cavity-causing bacteria. Try swapping one sugary drink for water tomorrow."
    elif habit_result["habit_score"] >= 9:
        coach_tip = "Perfect habits today — brushed, flossed, and used mouthwash. Consistency like this prevents expensive treatment."
    else:
        coach_tip = "Every habit you build now prevents costly treatment later. Small consistent steps make the biggest difference."

    base          = 60
    habit_bonus   = habit_result["habit_score"] * 3
    risk_penalty  = {"none": 0, "low": 5, "medium": 15, "high": 25}
    photo_penalty = {"none": 0, "low": 3, "medium": 8, "high": 15}.get(photo_risk, 0) if photo_analysis else 0
    score = min(100, max(0, base + habit_bonus - risk_penalty.get(risk_severity, 0) - photo_penalty))

    photo_result = None
    if photo_analysis:
        photo_result = {
            "summary":                   photo_analysis.get("summary"),
            "overall_visual_impression": photo_analysis.get("overall_visual_impression"),
            "areas_of_concern":          photo_analysis.get("areas_of_concern", []),
            "positive_signs":            photo_analysis.get("positive_signs", []),
            "visible_observations":      photo_analysis.get("visible_observations", []),
            "context_matched_findings":  photo_analysis.get("context_matched_findings", []),
            "recommended_action":        photo_analysis.get("recommended_action"),
            "photo_quality":             photo_analysis.get("photo_quality"),
            "photo_quality_note":        photo_analysis.get("photo_quality_note"),
            "disclaimer": (
                "This is an automated visual screening only — not a medical or dental diagnosis. "
                "Only a licensed dentist can diagnose dental conditions. "
                "If you have concerns, please consult a dental professional."
            ),
        }
    elif photo_error:
        photo_result = {
            "summary": "Photo analysis could not be completed.",
            "error":   photo_error,
            "disclaimer": "This is an automated visual screening only — not a medical diagnosis.",
        }

    alert = None
    if risk_severity in ("medium", "high"):
        alert = {
            "severity":    risk_severity,
            "flags":       risk_flags,
            "explanation": risk_explanation,
        }

    return {
        "dental_score":     score,
        "habit_score":      habit_result["habit_score"],
        "streak":           habit_result["streak"],
        "risk_severity":    risk_severity,
        "risk_flags":       risk_flags,
        "risk_explanation": risk_explanation,
        "coach_tip":        coach_tip,
        "photo_analysis":   photo_result,
        "alert":            alert,
    }