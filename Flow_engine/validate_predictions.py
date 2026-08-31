import json
import joblib
import pandas as pd
import numpy as np
import xgboost as xgb
from pathlib import Path
import warnings

warnings.filterwarnings("ignore")

PROJECT_PATH = Path(__file__).resolve().parent
REPORTS_PATH = PROJECT_PATH / "reports"
MODELS_PATH = PROJECT_PATH / "models"

def main():
    json_path = REPORTS_PATH / "demo1_extracted_features.json"
    if not json_path.exists():
        raise FileNotFoundError(f"{json_path} missing")
        
    with open(json_path, "r") as f:
        flows = json.load(f)
        
    print(f"Loaded {len(flows)} flows from JS extractor.")
    
    # Extract flow metadata and features
    metadata_list = []
    feature_list = []
    
    for idx, flow in enumerate(flows):
        metadata = flow.get("metadata", {})
        metadata["flow_index"] = idx
        features = flow.get("features", {})
        metadata_list.append(metadata)
        feature_list.append(features)
        
    df_meta = pd.DataFrame(metadata_list)
    df_feat = pd.DataFrame(feature_list)
    
    # Phase 3: Save extracted features to CSV
    df_combined = pd.concat([df_meta, df_feat], axis=1)
    csv_features_path = REPORTS_PATH / "demo1_extracted_features.csv"
    df_combined.to_csv(csv_features_path, index=False)
    print(f"Saved {csv_features_path}")
    
    # Phase 4: Verify Feature Order
    xgb_features = joblib.load(MODELS_PATH / "feature_names.pkl")
    
    # Ensure all required features are present
    missing_features = [f for f in xgb_features if f not in df_feat.columns]
    if missing_features:
        print(f"ERROR: Missing features from JS extractor: {missing_features}")
    
    # Check exact order
    actual_features = list(df_feat.columns)
    mismatch = False
    for i, expected in enumerate(xgb_features):
        if i >= len(actual_features) or actual_features[i] != expected:
            print(f"Feature order mismatch at index {i}. Expected: {expected}, Actual: {actual_features[i] if i < len(actual_features) else 'N/A'}")
            mismatch = True
    
    if mismatch:
        print("WARNING: Feature extraction order does not exactly match training order (though Pandas aligns it, we must document it).")
        
    # Phase 5: Verify XGBoost
    xgb_model = xgb.XGBClassifier()
    xgb_model.load_model(MODELS_PATH / "xgboost_traffic_classifier.json")
    le = joblib.load(MODELS_PATH / "label_encoder.pkl")
    medians = joblib.load(MODELS_PATH / "imputation_medians.pkl")
    impute_features = list(medians.index)
    
    # Ensure missing columns exist
    for col in xgb_features:
        if col not in df_feat.columns:
            df_feat[col] = np.nan
            
    # Impute
    for col in impute_features:
        if col in df_feat.columns:
            df_feat[col] = df_feat[col].fillna(medians[col])
            
    # Impute remainder
    df_feat = df_feat.fillna(0)
    
    df_xgb = df_feat[xgb_features]
    xgb_proba = xgb_model.predict_proba(df_xgb)
    xgb_preds = np.argmax(xgb_proba, axis=1)
    xgb_labels = le.inverse_transform(xgb_preds)
    
    xgb_results = []
    for i in range(len(flows)):
        res = {
            "flow_index": i,
            "src_ip": df_meta.iloc[i].get("srcIp"),
            "dst_ip": df_meta.iloc[i].get("dstIp"),
            "src_port": df_meta.iloc[i].get("srcPort"),
            "dst_port": df_meta.iloc[i].get("dstPort"),
            "predicted_class": xgb_preds[i],
            "decoded_class_name": xgb_labels[i],
            "maximum_probability": np.max(xgb_proba[i]),
            "confidence": np.max(xgb_proba[i]) * 100
        }
        for j, c in enumerate(le.classes_):
            res[f"prob_{c}"] = xgb_proba[i][j]
        xgb_results.append(res)
        
    df_xgb_out = pd.DataFrame(xgb_results)
    df_xgb_out.to_csv(REPORTS_PATH / "demo1_xgboost_predictions.csv", index=False)
    print("Saved demo1_xgboost_predictions.csv")
    
    # Phase 6: Verify Isolation Forest
    if_model = joblib.load(MODELS_PATH / "isolation_forest.pkl")
    if_scaler = joblib.load(MODELS_PATH / "isolation_forest_scaler.pkl")
    if_features = joblib.load(MODELS_PATH / "isolation_forest_features.pkl")
    if_calibration = joblib.load(MODELS_PATH / "anomaly_calibration.pkl")
    
    df_if = df_feat[if_features]
    df_if_scaled = if_scaler.transform(df_if)
    
    if_preds = if_model.predict(df_if_scaled)
    if_scores = if_model.score_samples(df_if_scaled)
    if_decision = if_model.decision_function(df_if_scaled)
    
    c_min = if_calibration["train_score_min"]
    c_max = if_calibration["train_score_max"]
    
    if_results = []
    for i in range(len(flows)):
        raw_score = if_scores[i]
        calibrated = ((c_max - raw_score) / (c_max - c_min)) * 100
        calibrated = max(0.0, min(100.0, calibrated))
        
        res = {
            "flow_index": i,
            "src_ip": df_meta.iloc[i].get("srcIp"),
            "dst_ip": df_meta.iloc[i].get("dstIp"),
            "raw_score": raw_score,
            "decision_function": if_decision[i],
            "calibrated_anomaly_score": calibrated,
            "anomaly_label": -1 if if_preds[i] == -1 else 1,
            "train_score_min": c_min,
            "train_score_max": c_max
        }
        if_results.append(res)
        
    df_if_out = pd.DataFrame(if_results)
    df_if_out.to_csv(REPORTS_PATH / "demo1_isolation_forest_predictions.csv", index=False)
    print("Saved demo1_isolation_forest_predictions.csv")
    
    print("Prediction validation complete.")

if __name__ == "__main__":
    main()
