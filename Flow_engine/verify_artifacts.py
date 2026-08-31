import joblib
import xgboost as xgb
import pandas as pd
import numpy as np
from pathlib import Path

PROJECT_PATH = Path(__file__).resolve().parent
MODELS_PATH = PROJECT_PATH / "models"

def verify_all_artifacts():
    print("Verifying artifacts...")
    artifacts = [
        "xgboost_traffic_classifier.json",
        "label_encoder.pkl",
        "feature_names.pkl",
        "imputation_medians.pkl",
        "isolation_forest.pkl",
        "isolation_forest_scaler.pkl",
        "isolation_forest_features.pkl",
        "anomaly_calibration.pkl"
    ]
    
    for filename in artifacts:
        filepath = MODELS_PATH / filename
        if filepath.exists():
            print(f"[EXISTS] {filename} (Size: {filepath.stat().st_size} bytes)")
        else:
            print(f"[MISSING] {filename}")
            return False
            
    print("\n--- Reload Test ---")
    
    try:
        xgb_model = xgb.XGBClassifier()
        xgb_model.load_model(MODELS_PATH / "xgboost_traffic_classifier.json")
        print("[SUCCESS] Loaded XGBoost")
        
        le = joblib.load(MODELS_PATH / "label_encoder.pkl")
        xgb_features = joblib.load(MODELS_PATH / "feature_names.pkl")
        medians = joblib.load(MODELS_PATH / "imputation_medians.pkl")
        if_model = joblib.load(MODELS_PATH / "isolation_forest.pkl")
        if_scaler = joblib.load(MODELS_PATH / "isolation_forest_scaler.pkl")
        if_features = joblib.load(MODELS_PATH / "isolation_forest_features.pkl")
        if_calibration = joblib.load(MODELS_PATH / "anomaly_calibration.pkl")
        print("[SUCCESS] Loaded all PKL artifacts")
    except Exception as e:
        print(f"[ERROR] Failed during reload: {e}")
        return False
        
    print("\n--- Dummy Inference Test ---")
    try:
        # Create a dummy row matching XGBoost features
        dummy_data = {feat: 0.0 for feat in xgb_features}
        df_dummy = pd.DataFrame([dummy_data])
        
        # XGBoost prediction
        pred = xgb_model.predict(df_dummy)[0]
        pred_label = le.inverse_transform([pred])[0]
        
        # IF prediction
        df_if = df_dummy[if_features].copy()
        df_if_scaled = if_scaler.transform(df_if)
        
        if_pred = if_model.predict(df_if_scaled)[0]
        raw_score = if_model.score_samples(df_if_scaled)[0]
        
        c_min = if_calibration["train_score_min"]
        c_max = if_calibration["train_score_max"]
        anomaly_score = ((c_max - raw_score) / (c_max - c_min)) * 100
        anomaly_score = np.clip(anomaly_score, 0, 100)
        
        print(f"[SUCCESS] XGBoost Prediction: {pred_label}")
        print(f"[SUCCESS] Isolation Forest Prediction: {if_pred} (Anomaly Score: {anomaly_score:.2f})")
        return True
    except Exception as e:
        print(f"[ERROR] Inference test failed: {e}")
        return False

if __name__ == "__main__":
    success = verify_all_artifacts()
    if not success:
        exit(1)
