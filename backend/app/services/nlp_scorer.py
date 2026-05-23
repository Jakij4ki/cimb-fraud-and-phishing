import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

# Rule-based fallback keywords
RULES = {
    "urgensi": ["segera", "sekarang juga", "batas waktu", "akan diblokir",
                "rekening dibekukan", "verifikasi sekarang", "dalam 24 jam", 
                "dalam 1 jam", "hangus", "dinonaktifkan", "ditangguhkan",
                "kadaluarsa", "dibekukan", "pemblokiran"],
    "ancaman": ["akan dihapus", "dicurigai", "penipuan terdeteksi", 
                "harus konfirmasi", "atau akun anda", "diblokir otomatis",
                "ditangguhkan permanen", "rekening ditutup"],
    "iming": ["selamat", "menang", "hadiah", "terpilih", "lucky draw", 
              "pemenang", "reward hangus", "cashback gratis", "berhadiah", "undian"],
    "data_sensitif": ["pin anda", "kode otp", "nomor cvv", "foto ktp", 
                      "data lengkap", "password", "nomor rekening lengkap"],
    "tindakan": ["klik link", "download aplikasi", "update wajib", 
                 "hubungi segera", "transfer sekarang", "verifikasi wajib"]
}

def rule_based_predict(text: str) -> dict:
    text_lower = text.lower()
    detected_patterns = []
    
    for category, keywords in RULES.items():
        for kw in keywords:
            if kw in text_lower:
                detected_patterns.append(kw)

    detected_patterns = list(set(detected_patterns))
    
    match_count = len(detected_patterns)
    if match_count == 0:
        confidence = 0.1
    elif match_count == 1:
        confidence = 0.5
    elif match_count == 2:
        confidence = 0.7
    else:
        confidence = 0.9

    is_phishing = confidence >= 0.5

    return {
        "label": 1 if is_phishing else 0,
        "confidence": confidence,
        "is_phishing": is_phishing,
        "detected_patterns": detected_patterns,
        "method": "rule_based_fallback"
    }


# Global model variable
model = None

if settings.ENABLE_ML_MODEL:
    try:
        from app.ml.inference_nlp import PhishingNLPModel
        model = PhishingNLPModel(settings.ML_MODEL_PATH)
        logger.info("NLP mode: IndoBERT active")
    except Exception as e:
        if settings.NLP_FALLBACK_ENABLED:
            logger.warning(f"Failed to load NLP model. Activating rule-based fallback. Error: {str(e)}")
            logger.info("NLP mode: rule-based fallback")
        else:
            logger.error(f"Failed to load NLP model and fallback is disabled. Error: {str(e)}")
            raise RuntimeError(f"ML Model required but failed to load: {str(e)}")
else:
    logger.info("NLP mode: rule-based fallback")


async def score_text(text: str) -> dict:
    if not text.strip():
        return {
            "is_phishing": False,
            "confidence": 0.0,
            "label": "safe",
            "detected_patterns": [],
            "method": "empty"
        }

    try:
        if settings.ENABLE_ML_MODEL and model:
            res = model.predict(text)
            if res.get("method") == "rule_based":
                res["method"] = "rule_based_fallback"
            elif res.get("method") == "model":
                res["method"] = "indobert"
            return res
        else:
            return rule_based_predict(text)
    except Exception as e:
        logger.error(f"Error in NLP scoring: {str(e)}")
        if settings.NLP_FALLBACK_ENABLED:
            return rule_based_predict(text)
        return {
            "is_phishing": False,
            "confidence": 0.0,
            "label": "error",
            "detected_patterns": [],
            "method": "error",
            "error": str(e)
        }
