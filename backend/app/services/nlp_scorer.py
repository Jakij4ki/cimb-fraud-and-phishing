import logging

logger = logging.getLogger(__name__)

# Fallback block until the model is completely integrated
try:
    from app.ml.inference_nlp import PhishingNLPModel
    model = PhishingNLPModel()
except ImportError:
    model = None

async def score_text(text: str) -> dict:
    if not text.strip():
        return {
            "is_phishing": False,
            "confidence": 0.0,
            "label": "safe"
        }

    try:
        if model:
            # Assuming predict is sync, but we are inside an async function.
            # Usually we'd use run_in_threadpool if inference is heavy and blocking.
            return model.predict(text)
        else:
            # Graceful fallback if ML is not ready yet
            return {
                "is_phishing": False,
                "confidence": 0.0,
                "label": "unknown",
                "error": "Model not loaded"
            }
    except Exception as e:
        logger.error(f"Error in NLP scoring: {str(e)}")
        return {
            "is_phishing": False,
            "confidence": 0.0,
            "label": "error",
            "error": str(e)
        }
