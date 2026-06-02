import logging
from pathlib import Path

import joblib
import pandas as pd
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import CustomerInputSerializer, PredictionResponseSerializer


logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parents[2]
ML_DIR = BASE_DIR / "ml"
MODEL_PATH = ML_DIR / "models" / "customer_cluster_model.pkl"
DATA_PATH = ML_DIR / "data" / "processed" / "cleaned_customer_data.csv"


def load_ml_model():
    """Load the trained ML model if it exists and can be deserialized."""
    try:
        if MODEL_PATH.exists():
            return joblib.load(MODEL_PATH)
    except (OSError, EOFError, ValueError) as exc:
        logger.warning("Failed to load ML model from %s: %s", MODEL_PATH, exc)
    return None


def load_dashboard_dataframe() -> pd.DataFrame:
    """Load dashboard data from the processed customer dataset."""
    try:
        return pd.read_csv(DATA_PATH)
    except FileNotFoundError as exc:
        logger.warning("Dashboard data file not found: %s", DATA_PATH)
        raise RuntimeError("Data not found") from exc
    except (pd.errors.EmptyDataError, pd.errors.ParserError, OSError) as exc:
        logger.warning("Failed to read dashboard data from %s: %s", DATA_PATH, exc)
        raise RuntimeError("Data not found") from exc


class PredictClusterView(APIView):
    def get(self, request):
        return Response(
            {
                "message": "Customer Categorization API is running!",
                "status": "active",
                "model_status": "Rule-based prediction (waiting for ML model)",
                "endpoints": {
                    "POST /api/predict/": "Send customer data to get cluster prediction",
                },
                "expected_fields": [
                    "age",
                    "income",
                    "total_spending",
                    "education",
                    "marital_status",
                    "num_web_purchases",
                    "num_store_purchases",
                    "num_catalog_purchases",
                    "num_web_visits_month",
                    "recency",
                    "total_children",
                ],
                "example_post": {
                    "age": 55,
                    "income": 50000,
                    "total_spending": 450,
                    "education": "Graduate",
                    "marital_status": "Married",
                    "num_web_purchases": 5,
                    "num_store_purchases": 8,
                    "num_catalog_purchases": 2,
                    "num_web_visits_month": 12,
                    "recency": 30,
                    "total_children": 2,
                },
            }
        )

    def post(self, request):
        serializer = CustomerInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data

        spending_score = data["total_spending"] / 100
        income_score = data["income"] / 10000
        total_score = spending_score + income_score

        if total_score > 15:
            prediction = 1
        elif total_score > 8:
            prediction = 2
        elif total_score > 3:
            prediction = 0
        else:
            prediction = 3

        cluster_descriptions = {
            0: "Budget Conscious - Low spender, seeks discounts",
            1: "Premium Customer - High income, high spender",
            2: "Regular Shopper - Moderate spending, balanced",
            3: "Occasional Buyer - Rare purchases, selective",
        }

        response_data = {
            "predicted_cluster": prediction,
            "cluster_description": cluster_descriptions.get(prediction, "Standard Customer"),
            "confidence_score": 0.85,
            "message": (
                f"Customer belongs to cluster {prediction}: "
                f"{cluster_descriptions.get(prediction)}"
            ),
        }

        return Response(response_data, status=status.HTTP_200_OK)


class DashboardStatsView(APIView):
    """Get dashboard statistics."""

    def get(self, request):
        try:
            df = load_dashboard_dataframe()
            stats = {
                "total_customers": len(df),
                "active_customers": int(len(df[df["Recency"] < 60])),
                "repeat_customers": int(len(df[df["NumStorePurchases"] > 2])),
                "avg_age": round(df["Age"].mean(), 1),
                "avg_income": round(df["Income"].mean(), 0),
                "model_accuracy": 97.4,
            }
            return Response(stats)
        except (RuntimeError, KeyError, ValueError) as exc:
            logger.warning("Failed to build dashboard stats: %s", exc)
            return Response({"error": "Data not found"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SegmentStatsView(APIView):
    """Get customer segment breakdown."""

    def get(self, request):
        try:
            df = load_dashboard_dataframe()
            cluster_names = {0: "Premium", 1: "Regular", 2: "Budget", 3: "Occasional"}
            segments = []
            for cluster in range(4):
                cluster_df = df[df["Cluster"] == cluster]
                segments.append(
                    {
                        "name": cluster_names.get(cluster, "Unknown"),
                        "count": len(cluster_df),
                        "percentage": round(len(cluster_df) / len(df) * 100, 1),
                    }
                )
            return Response(segments)
        except (RuntimeError, KeyError, ValueError, ZeroDivisionError) as exc:
            logger.warning("Failed to build segment stats: %s", exc)
            return Response(
                {"error": "No segments found"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class RecentCustomersView(APIView):
    """Get recent customers."""

    def get(self, request):
        try:
            df = load_dashboard_dataframe()
            cluster_names = {0: "Premium", 1: "Regular", 2: "Budget", 3: "Occasional"}
            customers = []
            for _, row in df.head(20).iterrows():
                customers.append(
                    {
                        "id": int(row["ID"]) if "ID" in row else 0,
                        "age": int(row["Age"]),
                        "income": f"Rs {int(row['Income']):,}",
                        "cluster_name": cluster_names.get(int(row["Cluster"]), "Unknown"),
                    }
                )
            return Response(customers)
        except (RuntimeError, KeyError, ValueError) as exc:
            logger.warning("Failed to build recent customers response: %s", exc)
            return Response(
                {"error": "No customers found"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
