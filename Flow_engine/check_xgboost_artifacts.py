import joblib
import xgboost as xgb
from pathlib import Path

MODELS_PATH = Path("models")

def verify_artifacts():
    print("Checking artifacts...")
    artifacts = [
        "xgboost_traffic_classifier.json",
        "label_encoder.pkl",
        "feature_names.pkl"
    ]
    
    for filename in artifacts:
        filepath = MODELS_PATH / filename
        if filepath.exists():
            print(f"[EXISTS] {filename} (Size: {filepath.stat().st_size} bytes)")
        else:
            print(f"[MISSING] {filename}")
            
    try:
        xgb_model = xgb.XGBClassifier()
        xgb_model.load_model(MODELS_PATH / "xgboost_traffic_classifier.json")
        print("[SUCCESS] Loaded xgboost_traffic_classifier.json")
    except Exception as e:
        print(f"[ERROR] Failed to load xgboost_traffic_classifier.json: {e}")
        
    try:
        le = joblib.load(MODELS_PATH / "label_encoder.pkl")
        print(f"[SUCCESS] Loaded label_encoder.pkl (Classes: {le.classes_})")
    except Exception as e:
        print(f"[ERROR] Failed to load label_encoder.pkl: {e}")
        
    try:
        features = joblib.load(MODELS_PATH / "feature_names.pkl")
        print(f"[SUCCESS] Loaded feature_names.pkl (Features: {len(features)})")
    except Exception as e:
        print(f"[ERROR] Failed to load feature_names.pkl: {e}")

if __name__ == "__main__":
    verify_artifacts()
