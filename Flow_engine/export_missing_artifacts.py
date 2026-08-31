import os
import joblib
import numpy as np
import pandas as pd
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import RobustScaler

PROJECT_PATH = Path(__file__).resolve().parent
MODELS_PATH = PROJECT_PATH / "models"
os.makedirs(MODELS_PATH, exist_ok=True)

csv_path = PROJECT_PATH.parent / "cleaned_traffic_data.csv"
if not csv_path.exists():
    raise FileNotFoundError(f"{csv_path} not found. Ensure cleaned data exists.")

df_model = pd.read_csv(csv_path)
print("Dataset shape:", df_model.shape)

X = df_model.drop(columns=["traffic_type"])
y = df_model["traffic_type"]

# 70% train, 15% validation, 15% test
X_train, X_temp, y_train, y_temp = train_test_split(
    X, y, test_size=0.30, stratify=y, random_state=42
)
X_val, X_test, y_val, y_test = train_test_split(
    X_temp, y_temp, test_size=0.50, stratify=y_temp, random_state=42
)

train_df = X_train.copy()

impute_features = [
    'min_fiat', 'min_biat', 'max_fiat', 'max_biat',
    'min_flowiat', 'max_flowiat', 'min_active',
    'max_active', 'min_idle', 'max_idle'
]

train_medians = train_df[impute_features].median()
joblib.dump(train_medians, MODELS_PATH / "imputation_medians.pkl")
print("[SUCCESS] Exported imputation_medians.pkl")

# Apply imputation for Isolation Forest training
train_df[impute_features] = train_df[impute_features].fillna(train_medians)
X_train = train_df.drop(columns=["traffic_type"] if "traffic_type" in train_df else [])

# Isolation forest features
features = [
    "duration", "total_fiat", "total_biat", "min_fiat", "min_biat",
    "max_fiat", "max_biat", "mean_fiat", "mean_biat", "flowPktsPerSecond",
    "flowBytesPerSecond", "min_flowiat", "max_flowiat", "mean_flowiat",
    "std_flowiat", "min_active", "mean_active", "max_active", "std_active",
    "min_idle", "mean_idle", "max_idle", "std_idle"
]

joblib.dump(features, MODELS_PATH / "isolation_forest_features.pkl")
print("[SUCCESS] Exported isolation_forest_features.pkl")

X_if_train = X_train[features].copy()
scaler_if = RobustScaler()
X_if_train_scaled = scaler_if.fit_transform(X_if_train)

joblib.dump(scaler_if, MODELS_PATH / "isolation_forest_scaler.pkl")
print("[SUCCESS] Exported isolation_forest_scaler.pkl")

isolation_forest = IsolationForest(
    n_estimators=200,
    contamination=0.10,
    random_state=42,
    n_jobs=-1
)
isolation_forest.fit(X_if_train_scaled)

joblib.dump(isolation_forest, MODELS_PATH / "isolation_forest.pkl")
print("[SUCCESS] Exported isolation_forest.pkl")

# Anomaly calibration
train_raw_scores = isolation_forest.score_samples(X_if_train_scaled)
calibration_data = {
    "train_score_min": float(train_raw_scores.min()),
    "train_score_max": float(train_raw_scores.max())
}
joblib.dump(calibration_data, MODELS_PATH / "anomaly_calibration.pkl")
print("[SUCCESS] Exported anomaly_calibration.pkl")

print("All required models exported successfully.")
