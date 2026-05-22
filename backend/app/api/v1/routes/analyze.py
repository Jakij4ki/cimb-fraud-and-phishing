import time
import logging
from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.analyze import AnalyzeRequest, AnalyzeResponse
from app.api.deps import get_db, get_client_ip, limiter
from app.services.extractor import MessageExtractor
from app.services.whitelist_checker import WhitelistChecker
from app.services.typosquatting import TyposquattingDetector
from app.services.nlp_scorer import score_text
from app.services.weighted_scorer import calculate_score
from app.services.explainer import generate_explanation

router = APIRouter()
logger = logging.getLogger(__name__)

extractor = MessageExtractor()
whitelist_checker = WhitelistChecker()
typosquatting_detector = TyposquattingDetector()

@router.post("/analyze", response_model=AnalyzeResponse)
@limiter.limit("10/minute")
async def analyze_message(
    request: Request,
    payload: AnalyzeRequest,
    db: AsyncSession = Depends(get_db)
):
    start_time = time.time()
    client_ip = get_client_ip(request)
    
    # Log IP & message_type ONLY (privacy)
    logger.info(f"Analyze request from IP: {client_ip}, type: {payload.message_type}")

    # a. Extractor (includes sanitization)
    components = extractor.extract(payload.message_text)
    
    # b. Whitelist
    whitelist_res = await whitelist_checker.check(components, db)
    
    # c. Typosquatting
    typos_alerts = await typosquatting_detector.detect(components.urls, db)
    
    # d. NLP
    nlp_res = await score_text(components.raw_text)
    
    # e. Score
    score_res = calculate_score(whitelist_res, nlp_res, start_time)
    
    # f. Explain
    explanation = generate_explanation(
        score_res.score, 
        score_res.risk_level, 
        whitelist_res, 
        nlp_res, 
        typos_alerts
    )
    
    components_dict = {
        "urls": [{"value": r.value, "is_whitelisted": r.is_whitelisted, "label": r.whitelist_label} for r in whitelist_res.url_results],
        "phones": [{"value": r.value, "is_whitelisted": r.is_whitelisted, "label": r.whitelist_label} for r in whitelist_res.phone_results],
        "emails": [{"value": r.value, "is_whitelisted": r.is_whitelisted, "label": r.whitelist_label} for r in whitelist_res.email_results]
    }

    return AnalyzeResponse(
        risk_score=score_res.score,
        risk_level=score_res.risk_level,
        explanation=explanation,
        breakdown=score_res.breakdown,
        typosquatting_alerts=[a.dict() for a in typos_alerts],
        components=components_dict,
        processing_time_ms=score_res.processing_time_ms
    )
