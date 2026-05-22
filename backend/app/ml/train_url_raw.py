import os
import json
import logging
import pandas as pd
import numpy as np
from urllib.parse import urlparse
import re
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

def extract_url_features(url: str) -> dict:
    if not url.startswith('http'):
        url = 'http://' + url
    
    try:
        parsed = urlparse(url)
        domain = parsed.netloc.lower()
        path = parsed.path
    except Exception:
        domain = ""
        path = ""
        
    url_length = len(url)
    domain_length = len(domain)
    has_https = 1 if url.startswith('https') else 0
    
    count_dots = url.count('.')
    count_hyphens = url.count('-')
    count_at = url.count('@')
    count_digits = sum(c.isdigit() for c in url)
    count_special = len(re.findall(r'[^a-zA-Z0-9\s.-]', url))
    
    suspicious_tlds = ['.xyz', '.site', '.online', '.click', '.top', '.club', 
                       '.info', '.biz', '.tk', '.ml', '.ga', '.cf', '.gq']
    suspicious_tld = 1 if any(domain.endswith(tld) for tld in suspicious_tlds) else 0
    
    # Check if domain is IP
    has_ip = 1 if re.match(r'^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$', domain.split(':')[0]) else 0
    
    url_depth = path.count('/')
    
    shorteners = ['bit.ly', 'tinyurl', 't.co', 's.id', 'ow.ly', 'goo.gl']
    has_shortener = 1 if any(s in domain for s in shorteners) else 0
    
    brand_keywords = ['cimb', 'bca', 'bri', 'mandiri', 'bni', 'btn', 'ocbc']
    has_brand_keyword = 1 if any(b in url.lower() for b in brand_keywords) else 0
    
    # Check if brand is in subdomain
    parts = domain.split('.')
    brand_in_subdomain = 0
    if len(parts) > 2:
        subdomains = parts[:-2]
        if any(b in '.'.join(subdomains) for b in brand_keywords):
            brand_in_subdomain = 1

    return {
        'url_length': url_length,
        'domain_length': domain_length,
        'has_https': has_https,
        'count_dots': count_dots,
        'count_hyphens': count_hyphens,
        'count_at': count_at,
        'count_digits': count_digits,
        'count_special': count_special,
        'suspicious_tld': suspicious_tld,
        'has_ip': has_ip,
        'url_depth': url_depth,
        'has_shortener': has_shortener,
        'has_brand_keyword': has_brand_keyword,
        'brand_in_subdomain': brand_in_subdomain
    }

def main():
    data_path = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'url_raw_classifier.csv')
    model_dir = os.path.join(os.path.dirname(__file__), 'model')
    os.makedirs(model_dir, exist_ok=True)
    
    logger.info(f"Loading raw URL dataset from {data_path}")
    if not os.path.exists(data_path):
        logger.error(f"Dataset not found at {data_path}")
        return

    df = pd.read_csv(data_path)
    
    logger.info("Extracting features from URLs...")
    features_list = [extract_url_features(url) for url in df['url']]
    features_df = pd.DataFrame(features_list)
    
    X = features_df
    y = df['label']
    
    # Train 70%, Val 15%, Test 15%
    X_train, X_temp, y_train, y_temp = train_test_split(
        X, y, test_size=0.3, random_state=42, stratify=y
    )
    X_val, X_test, y_val, y_test = train_test_split(
        X_temp, y_temp, test_size=0.5, random_state=42, stratify=y_temp
    )
    
    logger.info(f"Training RandomForest... Train:{len(X_train)} Test:{len(X_test)}")
    clf = RandomForestClassifier(n_estimators=200, max_depth=20, class_weight='balanced', random_state=42)
    clf.fit(X_train, y_train)
    
    preds = clf.predict(X_test)
    report = classification_report(y_test, preds, target_names=["legit", "phishing"])
    logger.info("\nClassification Report:\n" + report)
    
    # Top 10 feature importance
    importances = clf.feature_importances_
    indices = np.argsort(importances)[::-1]
    logger.info("Top 10 Feature Importances:")
    for f in range(min(10, X.shape[1])):
        logger.info(f"{f+1}. {X.columns[indices[f]]} ({importances[indices[f]]:.4f})")
        
    model_path = os.path.join(model_dir, 'url_raw_clf.pkl')
    features_path = os.path.join(model_dir, 'url_raw_features.json')
    
    joblib.dump(clf, model_path)
    with open(features_path, 'w') as f:
        json.dump(list(X.columns), f)
        
    logger.info(f"Model and features saved to {model_dir}")

if __name__ == "__main__":
    main()
