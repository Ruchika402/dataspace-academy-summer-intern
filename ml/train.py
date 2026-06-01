from __future__ import annotations

import csv
from dataclasses import dataclass
from pathlib import Path
from typing import Any

try:
    import joblib  # type: ignore
    import numpy as np  # type: ignore
    from sklearn.ensemble import RandomForestClassifier  # type: ignore
    from sklearn.metrics import accuracy_score, f1_score  # type: ignore
    from sklearn.model_selection import train_test_split  # type: ignore
    from sklearn.preprocessing import StandardScaler  # type: ignore
    from xgboost import XGBClassifier  # type: ignore
except ModuleNotFoundError as exc:  # pragma: no cover
    missing = exc.name or "a required dependency"
    raise ModuleNotFoundError(
        f"Missing dependency '{missing}'. To train models, install the ML dependencies "
        "(numpy, scikit-learn, joblib, xgboost) in your Python environment."
    ) from exc


BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "data" / "processed" / "featured_data_standard.csv"
RAW_PATH = BASE_DIR / "data" / "processed" / "cleaned_customer_data.csv"
MODEL_DIR = BASE_DIR / "models"
MODEL_PATH = MODEL_DIR / "customer_cluster_model.pkl"
FEATURES_PATH = MODEL_DIR / "feature_columns.pkl"
SCALER_PATH = MODEL_DIR / "scaler_standard.pkl"

# These are the fields the Django API can provide after validation.
FEATURE_COLUMNS: list[str] = [
    "Age",
    "Income",
    "Recency",
    "NumWebPurchases",
    "NumStorePurchases",
    "NumCatalogPurchases",
    "NumWebVisitsMonth",
    "TotalChildren",
    "Education_Encoded",
    "Marital_Encoded",
]

NUMERIC_COLUMNS: list[str] = [
    "Age",
    "Income",
    "Recency",
    "NumWebPurchases",
    "NumStorePurchases",
    "NumCatalogPurchases",
    "NumWebVisitsMonth",
    "TotalChildren",
]

TARGET_SPENDING_COLUMN = "TotalSpending"
TARGET_COLUMN_NAME = "target"


class TrainingDataError(RuntimeError):
    """Raised when the training dataset is missing or invalid."""


@dataclass(frozen=True)
class Dataset:
    x: np.ndarray
    y: np.ndarray
    feature_columns: list[str]


def _require_file(path: Path, hint: str) -> None:
    if not path.exists():
        raise FileNotFoundError(f"{hint} Not found: {path}")


def _safe_float(value: Any, field_name: str) -> float:
    try:
        return float(value)
    except (TypeError, ValueError) as exc:
        raise TrainingDataError(f"Invalid numeric value for '{field_name}': {value!r}") from exc


def _load_csv_rows(path: Path) -> list[dict[str, str]]:
    hint = "Feature-engineered dataset is required."
    _require_file(path, hint)
    with path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        if not reader.fieldnames:
            raise TrainingDataError(f"Dataset has no header: {path}")
        return list(reader)


def _build_dataset(rows: list[dict[str, str]]) -> Dataset:
    missing_columns = [c for c in FEATURE_COLUMNS + [TARGET_SPENDING_COLUMN] if c not in rows[0]]
    if missing_columns:
        raise TrainingDataError(
            f"Dataset is missing required columns: {missing_columns}. "
            f"Found columns: {sorted(rows[0].keys())}"
        )

    x_values: list[list[float]] = []
    spending_values: list[float] = []

    for row in rows:
        try:
            x_row = [_safe_float(row.get(col), col) for col in FEATURE_COLUMNS]
            spending = _safe_float(row.get(TARGET_SPENDING_COLUMN), TARGET_SPENDING_COLUMN)
        except TrainingDataError:
            continue
        x_values.append(x_row)
        spending_values.append(spending)

    if len(x_values) < 50:
        raise TrainingDataError(
            f"Not enough valid rows to train (got {len(x_values)}). "
            "Check for missing/invalid values in the processed dataset."
        )

    x = np.asarray(x_values, dtype=float)
    spending = np.asarray(spending_values, dtype=float)

    # Build quartile-based clusters from TotalSpending (monotonic w.r.t. raw spending).
    quantiles = np.quantile(spending, [0.25, 0.5, 0.75])
    y = np.digitize(spending, bins=quantiles, right=True).astype(int)
    if len(set(y.tolist())) < 2:
        raise TrainingDataError("Target generation produced fewer than two classes.")

    return Dataset(x=x, y=y, feature_columns=list(FEATURE_COLUMNS))


def _evaluate_model(name: str, model: Any, x_test: np.ndarray, y_test: np.ndarray) -> dict[str, float]:
    predictions = model.predict(x_test)
    accuracy = float(accuracy_score(y_test, predictions))
    weighted_f1 = float(f1_score(y_test, predictions, average="weighted"))
    return {"accuracy": accuracy, "weighted_f1": weighted_f1}


def _train_model(name: str, model: Any, x_train: np.ndarray, y_train: np.ndarray) -> Any:
    print(f"\n{' Training ' + name + ' ':=^60}")
    model.fit(x_train, y_train)
    return model


def main() -> None:
    print("🚀 ML training started")

    rows = _load_csv_rows(DATA_PATH)
    dataset = _build_dataset(rows)

    # Fit a scaler on the *raw* cleaned dataset so Django can standardize user inputs
    # into the same standardized space as `featured_data_standard.csv`.
    _require_file(RAW_PATH, "Cleaned dataset is required to fit scaler for prediction.")
    raw_rows = _load_csv_rows(RAW_PATH)
    raw_numeric: list[list[float]] = []
    for row in raw_rows:
        try:
            raw_numeric.append([_safe_float(row.get(col), col) for col in NUMERIC_COLUMNS])
        except TrainingDataError:
            continue
    if len(raw_numeric) < 50:
        raise TrainingDataError(
            f"Not enough valid rows to fit scaler (got {len(raw_numeric)}). "
            "Check the cleaned dataset for missing/invalid values."
        )
    scaler = StandardScaler()
    scaler.fit(np.asarray(raw_numeric, dtype=float))

    x_train, x_test, y_train, y_test = train_test_split(
        dataset.x,
        dataset.y,
        test_size=0.2,
        random_state=42,
        stratify=dataset.y,
    )

    rf_model = RandomForestClassifier(
        n_estimators=300,
        random_state=42,
        class_weight="balanced",
        n_jobs=-1,
    )
    xgb_model = XGBClassifier(
        n_estimators=300,
        max_depth=5,
        learning_rate=0.05,
        subsample=0.9,
        colsample_bytree=0.9,
        random_state=42,
        eval_metric="mlogloss",
        n_jobs=-1,
    )

    rf_model = _train_model("Random Forest", rf_model, x_train, y_train)
    rf_metrics = _evaluate_model("Random Forest", rf_model, x_test, y_test)
    print(f"Random Forest accuracy: {rf_metrics['accuracy']:.4f}")
    print(f"Random Forest weighted F1: {rf_metrics['weighted_f1']:.4f}")

    xgb_model = _train_model("XGBoost", xgb_model, x_train, y_train)
    xgb_metrics = _evaluate_model("XGBoost", xgb_model, x_test, y_test)
    print(f"XGBoost accuracy: {xgb_metrics['accuracy']:.4f}")
    print(f"XGBoost weighted F1: {xgb_metrics['weighted_f1']:.4f}")

    candidates = [
        ("RandomForestClassifier", rf_model, rf_metrics),
        ("XGBClassifier", xgb_model, xgb_metrics),
    ]
    best_name, best_model, best_metrics = max(
        candidates,
        key=lambda item: (item[2]["weighted_f1"], item[2]["accuracy"]),
    )

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(best_model, MODEL_PATH)
    joblib.dump(dataset.feature_columns, FEATURES_PATH)
    joblib.dump(scaler, SCALER_PATH)

    print("\n🏆 Best model:", best_name)
    print(f"📈 Accuracy: {best_metrics['accuracy']:.4f}")
    print(f"📈 Weighted F1: {best_metrics['weighted_f1']:.4f}")
    print(f"💾 Model saved to: {MODEL_PATH}")
    print(f"💾 Feature columns saved to: {FEATURES_PATH}")
    print(f"💾 Scaler saved to: {SCALER_PATH}")
    print("✅ Training completed successfully")


if __name__ == "__main__":
    main()
