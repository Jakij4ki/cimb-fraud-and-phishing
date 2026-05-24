import os
import logging
from concurrent.futures import ThreadPoolExecutor, TimeoutError
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

logger = logging.getLogger(__name__)

class PhishingNLPModel:
    def __init__(self, model_path: str = None):
        if model_path is None:
            # Default path based on training script output
            model_path = os.path.join(os.path.dirname(__file__), 'model', 'indobert-phishing')
            
        self.is_fallback = False
        self.tokenizer = None
        self.model = None
        self.executor = ThreadPoolExecutor(max_workers=4)

        try:
            if not os.path.exists(model_path):
                raise FileNotFoundError(f"Model path does not exist: {model_path}")
                
            self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
            self.tokenizer = AutoTokenizer.from_pretrained(model_path)
            self.model = AutoModelForSequenceClassification.from_pretrained(model_path)
            self.model.to(self.device)
            self.model.eval()
            logger.info("NLP model loaded successfully.")
        except Exception as e:
            logger.warning(f"Failed to load NLP model. Activating rule-based fallback. Error: {str(e)}")
            self.is_fallback = True

        self.rules = {
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

    def _rule_based_predict(self, text: str) -> dict:
        text_lower = text.lower()
        detected_patterns = []
        
        for category, keywords in self.rules.items():
            for kw in keywords:
                if kw in text_lower:
                    detected_patterns.append(kw)

        # Deduplicate
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
            "method": "rule_based"
        }

    def _model_predict(self, text: str) -> dict:
        if self.is_fallback:
            return self._rule_based_predict(text)
            
        inputs = self.tokenizer(text, return_tensors="pt", truncation=True, max_length=128, padding=True)
        inputs = {k: v.to(self.device) for k, v in inputs.items()}
        
        with torch.no_grad():
            outputs = self.model(**inputs)
            logits = outputs.logits
            probs = torch.nn.functional.softmax(logits, dim=-1)
            
        confidence, predicted_class = torch.max(probs, dim=-1)
        label = predicted_class.item()
        conf_val = confidence.item()
        
        is_phishing = bool(label == 1)
        
        # Augment detected patterns even when using model
        detected_patterns = []
        text_lower = text.lower()
        if is_phishing:
            for keywords in self.rules.values():
                for kw in keywords:
                    if kw in text_lower:
                        detected_patterns.append(kw)
                        
        return {
            "label": label,
            "confidence": conf_val,
            "is_phishing": is_phishing,
            "detected_patterns": list(set(detected_patterns)),
            "method": "model"
        }

    def predict(self, text: str) -> dict:
        try:
            future = self.executor.submit(self._model_predict, text)
            # Timeout 30 seconds to handle PyTorch CPU cold-start on first inference
            return future.result(timeout=30.0)
        except TimeoutError:
            logger.warning("NLP model prediction timed out. Falling back to rule-based.")
            return self._rule_based_predict(text)
        except Exception as e:
            logger.error(f"NLP model error: {str(e)}. Falling back to rule-based.")
            return self._rule_based_predict(text)

# Singleton instance
nlp_model = PhishingNLPModel()
