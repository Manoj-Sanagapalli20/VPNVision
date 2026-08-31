import sys
import json
import joblib
import pandas as pd
import numpy as np
import xgboost as xgb
from pathlib import Path
import warnings

# Suppress sklearn warnings to keep stdout clean for JSON parsing
warnings.filterwarnings("ignore")

PROJECT_PATH = Path(__file__).resolve().parent
MODELS_PATH = PROJECT_PATH / "models"

def main():
    try:
        # Load artifacts
        xgb_model = xgb.XGBClassifier()
        xgb_model.load_model(MODELS_PATH / "xgboost_traffic_classifier.json")
        
        le = joblib.load(MODELS_PATH / "label_encoder.pkl")
        xgb_features = joblib.load(MODELS_PATH / "feature_names.pkl")
        medians = joblib.load(MODELS_PATH / "imputation_medians.pkl")
        if_model = joblib.load(MODELS_PATH / "isolation_forest.pkl")
        if_scaler = joblib.load(MODELS_PATH / "isolation_forest_scaler.pkl")
        if_features = joblib.load(MODELS_PATH / "isolation_forest_features.pkl")
        if_calibration = joblib.load(MODELS_PATH / "anomaly_calibration.pkl")
        
        impute_features = list(medians.index)
        
        # Read from stdin
        input_data = sys.stdin.read()
        if not input_data.strip():
            print(json.dumps({"error": "No input provided"}))
            sys.exit(1)
            
        flows = json.loads(input_data)
        
        if not isinstance(flows, list):
            flows = [flows]
            
        if len(flows) == 0:
            print(json.dumps([]))
            sys.exit(0)
            
        # Extract features dictionaries
        feature_list = [f.get("features", f) for f in flows]
        df = pd.DataFrame(feature_list)
        
        # Missing columns
        for col in xgb_features:
            if col not in df.columns:
                df[col] = np.nan
                
        # Fill missing with medians for specified impute_features
        for col in impute_features:
            if col in df.columns:
                df[col] = df[col].fillna(medians[col])
                
        # Fill remaining missing with 0 to prevent xgboost crash
        df = df.fillna(0)
                
        # XGBoost Prediction
        df_xgb = df[xgb_features]
        xgb_proba = xgb_model.predict_proba(df_xgb)
        xgb_preds = np.argmax(xgb_proba, axis=1)
        xgb_labels = le.inverse_transform(xgb_preds)
        
        # Isolation Forest Prediction
        df_if = df[if_features]
        df_if_scaled = if_scaler.transform(df_if)
        if_preds = if_model.predict(df_if_scaled)
        if_scores = if_model.score_samples(df_if_scaled)
        
        c_min = if_calibration["train_score_min"]
        c_max = if_calibration["train_score_max"]
        
        results = []
        for i in range(len(flows)):
            # XGBoost
            classification = xgb_labels[i]
            confidence = float(xgb_proba[i][xgb_preds[i]] * 100)
            
            # IF
            raw_score = if_scores[i]
            anomaly_score = float(((c_max - raw_score) / (c_max - c_min)) * 100)
            anomaly_score = max(0.0, min(100.0, anomaly_score))
            status = "ANOMALY" if if_preds[i] == -1 else "NORMAL"
            
            results.append({
                "flowIndex": i,
                "classification": classification,
                "confidence": round(confidence, 2),
                "anomalyStatus": status,
                "anomalyScore": round(anomaly_score, 2)
            })
            
        print(json.dumps(results))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
