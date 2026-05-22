import os
import json
import logging
import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report
import joblib

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

def main():
    data_path = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'url_features_phiusiil.csv')
    model_dir = os.path.join(os.path.dirname(__file__), 'model')
    os.makedirs(model_dir, exist_ok=True)
    
    logger.info(f"Loading PhiUSIIL URL features dataset from {data_path}")
    if not os.path.exists(data_path):
        logger.error(f"Dataset not found at {data_path}")
        return

    df = pd.read_csv(data_path)
    
    # Drop non-numeric columns
    drop_cols = ['url', 'Domain', 'TLD', 'source', 'data_type']
    drop_cols = [c for c in drop_cols if c in df.columns]
    df = df.drop(columns=drop_cols)
    
    # Handle missing values with median
    for col in df.columns:
        if df[col].isnull().any():
            df[col] = df[col].fillna(df[col].median())
            
    # Define features and label
    X = df.drop(columns=['label'])
    y = df['label']
    
    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    X_scaled = pd.DataFrame(X_scaled, columns=X.columns)
    
    # Train 70%, Val 15%, Test 15%
    X_train, X_temp, y_train, y_temp = train_test_split(
        X_scaled, y, test_size=0.3, random_state=42, stratify=y
    )
    X_val, X_test, y_val, y_test = train_test_split(
        X_temp, y_temp, test_size=0.5, random_state=42, stratify=y_temp
    )
    
    logger.info(f"Training XGBoost... Train:{len(X_train)} Test:{len(X_test)}")
    clf = xgb.XGBClassifier(
        n_estimators=200, 
        max_depth=6, 
        learning_rate=0.1, 
        eval_metric='logloss',
        random_state=42
    )
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
        
    model_path = os.path.join(model_dir, 'url_feature_clf.pkl')
    scaler_path = os.path.join(model_dir, 'url_feature_scaler.pkl')
    features_path = os.path.join(model_dir, 'url_feature_columns.json')
    
    joblib.dump(clf, model_path)
    joblib.dump(scaler, scaler_path)
    with open(features_path, 'w') as f:
        json.dump(list(X.columns), f)
        
    logger.info(f"Model, scaler, and features saved to {model_dir}")

if __name__ == "__main__":
    main()
