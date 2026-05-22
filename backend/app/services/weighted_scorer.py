from pydantic import BaseModel
import time
from app.services.whitelist_checker import WhitelistResult

class ScoreResult(BaseModel):
    score: int
    risk_level: str
    breakdown: list[dict]
    processing_time_ms: float

def calculate_score(
    whitelist_result: WhitelistResult,
    nlp_result: dict,
    processing_start: float
) -> ScoreResult:
    
    score = 0
    breakdown = []

    has_components = bool(whitelist_result.url_results or whitelist_result.phone_results or whitelist_result.email_results)
    
    if whitelist_result.has_unknown_component:
        score += 80
        breakdown.append({
            "component": "whitelist",
            "points": 80,
            "reason_id": "Terdapat tautan, nomor telepon, atau email yang tidak terdaftar sebagai milik bank resmi."
        })

    is_phishing = nlp_result.get("is_phishing", False)
    if is_phishing:
        score += 20
        breakdown.append({
            "component": "nlp",
            "points": 20,
            "reason_id": "Pesan menggunakan pola bahasa yang manipulatif dan sering digunakan oleh penipu."
        })

    if not has_components and is_phishing:
        score = 100
        breakdown.append({
            "component": "override",
            "points": 100,
            "reason_id": "Pesan hanya berisi teks manipulatif tanpa komponen yang bisa diverifikasi."
        })

    # Cap score at 100
    score = min(score, 100)

    if score <= 30:
        risk_level = "safe"
    elif score <= 70:
        risk_level = "warning"
    else:
        risk_level = "danger"

    processing_time_ms = (time.time() - processing_start) * 1000

    return ScoreResult(
        score=score,
        risk_level=risk_level,
        breakdown=breakdown,
        processing_time_ms=round(processing_time_ms, 2)
    )
