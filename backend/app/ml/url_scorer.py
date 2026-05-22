import os
import json
import logging
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
from urllib.parse import urlparse
import re

logger = logging.getLogger(__name__)

class URLScoreResult(BaseModel):
    is_phishing: bool
    confidence: float
    risk_factors: list[str]
    method: str

class URLPhishingScorer:
    def __init__(self):
        self.is_fallback = False
        model_dir = os.path.join(os.path.dirname(__file__), 'model')
        
        try:
            self.raw_clf = joblib.load(os.path.join(model_dir, 'url_raw_clf.pkl'))
            with open(os.path.join(model_dir, 'url_raw_features.json'), 'r') as f:
                self.raw_features = json.load(f)
                
            self.feature_clf = joblib.load(os.path.join(model_dir, 'url_feature_clf.pkl'))
            self.scaler = joblib.load(os.path.join(model_dir, 'url_feature_scaler.pkl'))
            with open(os.path.join(model_dir, 'url_feature_columns.json'), 'r') as f:
                self.feature_columns = json.load(f)
                
            logger.info("URL classifiers loaded successfully.")
        except Exception as e:
            logger.warning(f"Failed to load URL classifiers. Using fallback. Error: {str(e)}")
            self.is_fallback = True

    def _extract_raw_features(self, url: str) -> dict:
        if not url.startswith('http'):
            url = 'http://' + url
            
        try:
            parsed = urlparse(url)
            domain = parsed.netloc.lower()
            path = parsed.path
        except:
            domain = ""
            path = ""
            
        suspicious_tlds = ['.xyz', '.site', '.online', '.click', '.top', '.club', 
                           '.info', '.biz', '.tk', '.ml', '.ga', '.cf', '.gq']
                           
        shorteners = ['bit.ly', 'tinyurl', 't.co', 's.id', 'ow.ly', 'goo.gl']
        brand_keywords = ['cimb', 'bca', 'bri', 'mandiri', 'bni', 'btn', 'ocbc']
        
        parts = domain.split('.')
        brand_in_subdomain = 0
        if len(parts) > 2:
            subdomains = parts[:-2]
            if any(b in '.'.join(subdomains) for b in brand_keywords):
                brand_in_subdomain = 1

        return {
            'url_length': len(url),
            'domain_length': len(domain),
            'has_https': 1 if url.startswith('https') else 0,
            'count_dots': url.count('.'),
            'count_hyphens': url.count('-'),
            'count_at': url.count('@'),
            'count_digits': sum(c.isdigit() for c in url),
            'count_special': len(re.findall(r'[^a-zA-Z0-9\s.-]', url)),
            'suspicious_tld': 1 if any(domain.endswith(tld) for tld in suspicious_tlds) else 0,
            'has_ip': 1 if re.match(r'^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$', domain.split(':')[0]) else 0,
            'url_depth': path.count('/'),
            'has_shortener': 1 if any(s in domain for s in shorteners) else 0,
            'has_brand_keyword': 1 if any(b in url.lower() for b in brand_keywords) else 0,
            'brand_in_subdomain': brand_in_subdomain
        }

    def _extract_phiusiil_features(self, url: str) -> dict:
        """Best effort extraction for PhiUSIIL features."""
        feat = {}
        try:
            parsed = urlparse(url if url.startswith('http') else 'http://' + url)
            domain = parsed.netloc.lower()
        except:
            domain = ""
            
        url_len = len(url)
        letters = sum(c.isalpha() for c in url)
        digits = sum(c.isdigit() for c in url)
        
        feat['URLLength'] = url_len
        feat['DomainLength'] = len(domain)
        feat['IsDomainIP'] = 1 if re.match(r'^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$', domain.split(':')[0]) else 0
        feat['URLSimilarityIndex'] = 100.0 # Dummy
        feat['CharContinuationRate'] = 1.0 # Dummy
        feat['TLDLegitimateProb'] = 0.5 # Dummy
        feat['URLCharProb'] = 0.05 # Dummy
        feat['TLDLength'] = len(domain.split('.')[-1]) if '.' in domain else 0
        feat['NoOfSubDomain'] = max(0, len(domain.split('.')) - 2)
        feat['HasObfuscation'] = 0
        feat['ObfuscationRatio'] = 0.0
        feat['NoOfLettersInURL'] = letters
        feat['LetterRatioInURL'] = letters / url_len if url_len > 0 else 0
        feat['NoOfDegitsInURL'] = digits
        feat['DegitRatioInURL'] = digits / url_len if url_len > 0 else 0
        feat['NoOfEqualsInURL'] = url.count('=')
        feat['NoOfQMarkInURL'] = url.count('?')
        feat['NoOfAmpersandInURL'] = url.count('&')
        specials = len(re.findall(r'[^a-zA-Z0-9]', url))
        feat['SpacialCharRatioInURL'] = specials / url_len if url_len > 0 else 0
        feat['IsHTTPS'] = 1 if url.startswith('https') else 0
        feat['NoOfURLRedirect'] = 0 
        feat['HasPasswordField'] = 0
        feat['Bank'] = 1 if 'bank' in url.lower() else 0
        feat['Pay'] = 1 if 'pay' in url.lower() else 0
        feat['Crypto'] = 1 if 'crypto' in url.lower() or 'coin' in url.lower() else 0
        feat['DomainTitleMatchScore'] = 0.0 
        feat['URLTitleMatchScore'] = 0.0 
        
        # Ensure all required columns are present to avoid DataFrame errors
        if not self.is_fallback:
            for col in self.feature_columns:
                if col not in feat:
                    feat[col] = 0.0
                    
        return feat

    def score(self, url: str) -> URLScoreResult:
        raw_feat = self._extract_raw_features(url)
        risk_factors = []
        
        if raw_feat['url_length'] > 75:
            risk_factors.append("URL sangat panjang (>75 karakter)")
        if raw_feat['suspicious_tld'] == 1:
            risk_factors.append("Menggunakan domain ekstensi tidak umum")
        if raw_feat['has_ip'] == 1:
            risk_factors.append("Domain berupa alamat IP")
        if raw_feat['has_shortener'] == 1:
            risk_factors.append("Menggunakan layanan penyingkat URL")
        if raw_feat['brand_in_subdomain'] == 1:
            risk_factors.append("Nama bank ada di subdomain bukan domain utama")
        if raw_feat['count_special'] > 5:
            risk_factors.append("Banyak karakter spesial mencurigakan")

        if self.is_fallback:
            # Rule based evaluation
            score = 0.0
            if raw_feat['has_ip'] or raw_feat['brand_in_subdomain']:
                score += 0.6
            if raw_feat['has_shortener'] or raw_feat['suspicious_tld']:
                score += 0.3
            if raw_feat['url_length'] > 75:
                score += 0.2
            
            confidence = min(score, 0.95)
            is_phishing = confidence > 0.5
            return URLScoreResult(
                is_phishing=is_phishing,
                confidence=confidence,
                risk_factors=risk_factors,
                method="rule_based"
            )

        try:
            # Predict from raw classifier
            raw_df = pd.DataFrame([raw_feat])[self.raw_features]
            raw_prob = self.raw_clf.predict_proba(raw_df)[0][1]
            
            # Predict from feature classifier
            phi_feat = self._extract_phiusiil_features(url)
            phi_df = pd.DataFrame([phi_feat])[self.feature_columns]
            phi_scaled = self.scaler.transform(phi_df)
            feature_prob = self.feature_clf.predict_proba(phi_scaled)[0][1]
            
            # Ensemble combination (40% raw, 60% features)
            combined_prob = (0.4 * raw_prob) + (0.6 * feature_prob)
            is_phishing = combined_prob > 0.5
            
            return URLScoreResult(
                is_phishing=bool(is_phishing),
                confidence=float(combined_prob),
                risk_factors=risk_factors,
                method="model_ensemble"
            )
            
        except Exception as e:
            logger.error(f"Error in URL scoring ensemble: {str(e)}")
            return URLScoreResult(
                is_phishing=bool(len(risk_factors) >= 2),
                confidence=0.8 if len(risk_factors) >= 2 else 0.2,
                risk_factors=risk_factors,
                method="error_fallback"
            )

# Singleton instance
url_scorer = URLPhishingScorer()
