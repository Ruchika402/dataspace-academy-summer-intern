from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from typing import Any, Mapping

try:
    import joblib  # type: ignore
    import numpy as np  # type: ignore
except ModuleNotFoundError as exc:  # pragma: no cover
    missing = exc.name or "a required dependency"
    raise ModuleNotFoundError(
        f"Missing dependency '{missing}'. To use ML prediction inside Django, install the ML "
        "dependencies (numpy, scikit-learn, joblib, xgboost if you trained an XGBClassifier)."
    ) from exc


BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "customer_cluster_model.pkl"
FEATURES_PATH = BASE_DIR / "models" / "feature_columns.pkl"
SCALER_PATH = BASE_DIR / "models" / "scaler_standard.pkl"

RAW_TO_FEATURE_MAP = {
    "age": "Age",
    "income": "Income",
    "recency": "Recency",
    "num_web_purchases": "NumWebPurchases",
    "num_store_purchases": "NumStorePurchases",
    "num_catalog_purchases": "NumCatalogPurchases",
    "num_web_visits_month": "NumWebVisitsMonth",
    "total_children": "TotalChildren",
}

EDUCATION_MAP = {
    "basic": 0,
    "graduate": 1,
    "postgraduate": 2,
}

MARITAL_MAP = {
    "single": 0,
    "married": 1,
}

NUMERIC_COLUMNS = [
    "Age",
    "Income",
    "Recency",
    "NumWebPurchases",
    "NumStorePurchases",
    "NumCatalogPurchases",
    "NumWebVisitsMonth",
    "TotalChildren",
]


class PredictorArtifactError(RuntimeError):
    """Raised when a required model artifact is missing or invalid."""

class PredictorInputError(ValueError):
    """Raised when input payload validation fails."""


@lru_cache(maxsize=1)
def load_artifacts():
    """Load the trained model and preprocessing artifacts once per process."""

    missing_files = [
        str(path)
        for path in (MODEL_PATH, FEATURES_PATH, SCALER_PATH)
        if not path.exists()
    ]
    if missing_files:
        raise PredictorArtifactError(
            "Missing model artifacts. Train the model first. Missing files: "
            f"{missing_files}"
        )

    model = joblib.load(MODEL_PATH)
    feature_columns = joblib.load(FEATURES_PATH)
    scaler = joblib.load(SCALER_PATH)
    return model, feature_columns, scaler


def _normalize_input(input_data: Mapping[str, Any]) -> dict[str, Any]:
    if not isinstance(input_data, Mapping):
        raise TypeError("input_data must be a mapping (e.g. dict).")
    return {str(key).strip().lower(): value for key, value in dict(input_data).items()}


def _encode_category(value: Any, mapping: dict[str, int], field_name: str) -> int:
    if value is None:
        raise PredictorInputError(f"'{field_name}' is required.")

    normalized_value = str(value).strip().lower()
    if normalized_value not in mapping:
        raise PredictorInputError(
            f"Invalid value for '{field_name}': {value!r}. Expected one of: {sorted(mapping.keys())}"
        )

    return mapping[normalized_value]


def _safe_float(value: Any, field_name: str) -> float:
    try:
        return float(value)
    except (TypeError, ValueError) as exc:
        raise PredictorInputError(f"Invalid numeric value for '{field_name}': {value!r}") from exc


def _validate_non_negative(value: float, field_name: str) -> float:
    if value < 0:
        raise PredictorInputError(f"'{field_name}' must be non-negative.")
    return value


def _build_feature_row(input_data: Mapping[str, Any], feature_columns: list[str], scaler) -> np.ndarray:
    record = _normalize_input(input_data)

    # Required numeric fields (raw user input)
    age = _validate_non_negative(_safe_float(record.get("age"), "age"), "age")
    income = _validate_non_negative(_safe_float(record.get("income"), "income"), "income")
    recency = _validate_non_negative(_safe_float(record.get("recency"), "recency"), "recency")
    num_web_purchases = _validate_non_negative(
        _safe_float(record.get("num_web_purchases"), "num_web_purchases"),
        "num_web_purchases",
    )
    num_store_purchases = _validate_non_negative(
        _safe_float(record.get("num_store_purchases"), "num_store_purchases"),
        "num_store_purchases",
    )
    num_catalog_purchases = _validate_non_negative(
        _safe_float(record.get("num_catalog_purchases"), "num_catalog_purchases"),
        "num_catalog_purchases",
    )
    num_web_visits_month = _validate_non_negative(
        _safe_float(record.get("num_web_visits_month"), "num_web_visits_month"),
        "num_web_visits_month",
    )
    total_children = _validate_non_negative(
        _safe_float(record.get("total_children"), "total_children"),
        "total_children",
    )

    education_encoded = _encode_category(record.get("education"), EDUCATION_MAP, "education")
    marital_encoded = _encode_category(record.get("marital_status"), MARITAL_MAP, "marital_status")

    numeric_raw = np.asarray(
        [
            age,
            income,
            recency,
            num_web_purchases,
            num_store_purchases,
            num_catalog_purchases,
            num_web_visits_month,
            total_children,
        ],
        dtype=float,
    ).reshape(1, -1)

    numeric_scaled = scaler.transform(numeric_raw).reshape(-1).tolist()
    base_features: dict[str, float] = dict(zip(NUMERIC_COLUMNS, numeric_scaled, strict=True))
    base_features["Education_Encoded"] = float(education_encoded)
    base_features["Marital_Encoded"] = float(marital_encoded)

    # Build row in the exact feature order used during training.
    return np.asarray([[base_features.get(col, 0.0) for col in feature_columns]], dtype=float)


def predict_customer(input_data: Mapping[str, Any]) -> int:
    """
    Predict the customer cluster from a single validated payload.

    Parameters
    ----------
    input_data:
        Dict-like payload such as:
        {
            "age": 30,
            "income": 50000,
            "recency": 15,
            "num_web_purchases": 5,
            "num_store_purchases": 3,
            "num_catalog_purchases": 2,
            "num_web_visits_month": 6,
            "total_children": 1,
            "education": "graduate",
            "marital_status": "single"
        }

    Returns
    -------
    int
        Predicted cluster label.
    """

    model, feature_columns, scaler = load_artifacts()
    x_row = _build_feature_row(input_data, list(feature_columns), scaler)
    prediction = model.predict(x_row)
    return int(prediction[0])
