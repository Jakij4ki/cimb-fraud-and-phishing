import pytest
from app.services.nlp_scorer import score_text
from app.core.config import settings
import importlib
import app.services.nlp_scorer as nlp_scorer

@pytest.mark.asyncio
async def test_fallback_enabled():
    # Force settings
    settings.ENABLE_ML_MODEL = False
    
    # Reload module to apply settings
    importlib.reload(nlp_scorer)
    
    text = "segera klik link ini untuk update wajib rekening anda"
    res = await nlp_scorer.score_text(text)
    
    assert res["method"] == "rule_based_fallback"
    assert res["is_phishing"] == True
    assert "update wajib" in res["detected_patterns"] or "segera" in res["detected_patterns"]

@pytest.mark.asyncio
async def test_ml_model_not_found_fallback():
    # Force settings to ML mode but no model exists
    settings.ENABLE_ML_MODEL = True
    settings.NLP_FALLBACK_ENABLED = True
    settings.ML_MODEL_PATH = "/invalid/path"
    
    importlib.reload(nlp_scorer)
    
    text = "selamat anda menang undian"
    res = await nlp_scorer.score_text(text)
    
    # Because model loading failed, it should fallback
    assert res["method"] == "rule_based_fallback"

@pytest.mark.asyncio
async def test_empty_text():
    settings.ENABLE_ML_MODEL = False
    importlib.reload(nlp_scorer)
    
    res = await nlp_scorer.score_text("   ")
    assert res["method"] == "empty"
    assert res["is_phishing"] == False
