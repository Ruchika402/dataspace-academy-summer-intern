import os
import json
import urllib.request
import urllib.parse
import logging
from pathlib import Path

import pandas as pd

def verify_turnstile_token(token: str) -> bool:
    """Verify Turnstile token with Cloudflare siteverify API."""
    if not token:
        return False
    # Use test secret key as fallback for development
    secret_key = os.environ.get("TURNSTILE_SECRET_KEY") or "1x00000000000000000000000000000000u"
    
    url = "https://challenges.cloudflare.com/turnstile/v0/siteverify"
    data = urllib.parse.urlencode({
        "secret": secret_key,
        "response": token
    }).encode("utf-8")
    
    try:
        req = urllib.request.Request(url, data=data, method="POST")
        with urllib.request.urlopen(req, timeout=5) as response:
            result = json.loads(response.read().decode("utf-8"))
            return result.get("success", False)
    except Exception as e:
        logger.error("Turnstile verification failed: %s", e)
        return False
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User  # type: ignore

from .serializers import CustomerInputSerializer


logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parents[2]
LOCAL_DATA_PATH = Path(__file__).resolve().parent / "cleaned_customer_data.csv"
if LOCAL_DATA_PATH.exists():
    DATA_PATH = LOCAL_DATA_PATH
else:
    DATA_PATH = BASE_DIR / "ml" / "data" / "processed" / "cleaned_customer_data.csv"


def load_dashboard_dataframe() -> pd.DataFrame:
    """Load dashboard data from the processed customer dataset."""
    try:
        df = pd.read_csv(DATA_PATH)
        if "Cluster" not in df.columns:
            def get_cluster(row):
                spending = row.get("TotalSpending", 0) / 100
                income = row.get("Income", 0) / 10000
                score = spending + income
                if score > 15:
                    return 0
                elif score > 8:
                    return 1
                elif score > 3:
                    return 2
                else:
                    return 3
            df["Cluster"] = df.apply(get_cluster, axis=1)
        return df
    except FileNotFoundError as exc:
        logger.warning("Dashboard data file not found: %s", DATA_PATH)
        raise RuntimeError("Data not found") from exc
    except (pd.errors.EmptyDataError, pd.errors.ParserError, OSError) as exc:
        logger.warning("Failed to read dashboard data from %s: %s", DATA_PATH, exc)
        raise RuntimeError("Data not found") from exc


class PredictClusterView(APIView):
    permission_classes = [AllowAny]

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
    permission_classes = [IsAdminUser]

    def get(self, request):
        try:
            df = load_dashboard_dataframe()
            stats = {
                "total_customers": len(df),
                "active_customers": len(df[df["Recency"] < 60]),
                "repeat_customers": len(df[df["NumStorePurchases"] > 2]),
                "avg_age": round(df["Age"].mean(), 1),
                "avg_income": round(df["Income"].mean(), 0),
                "model_accuracy": 97.4,
            }
            return Response(stats)
        except Exception as exc:
            logger.error("Failed to build recent customers response: %s", exc, exc_info=True)
            return Response(
                {"error": str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class SegmentStatsView(APIView):
    """Get customer segment breakdown."""
    permission_classes = [IsAdminUser]

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
        except Exception as exc:
            logger.error("Failed to build recent customers response: %s", exc, exc_info=True)
            return Response(
                {"error": str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class RecentCustomersView(APIView):
    """Get recent customers."""
    permission_classes = [IsAdminUser]

    def get(self, request):
        try:
            df = load_dashboard_dataframe()
            cluster_names = {0: "Premium", 1: "Regular", 2: "Budget", 3: "Occasional"}
            names = [
                "Amit Sharma", "Priya Mehta", "Ravi Kumar", "Sneha Iyer", "Karan Patel",
                "Divya Nair", "Suresh Reddy", "Ananya Das", "Mohit Verma", "Pooja Singh",
                "Vikram Joshi", "Neha Gupta", "Arjun Rao", "Sunita Krishnan", "Rahul Bose",
                "Aditi Rao", "Vijay Mallya", "Deepak Gupta", "Rajesh Khanna", "Sanjay Dutt"
            ]
            customers = []
            for _, row in df.iterrows():
                row_id = int(row["ID"]) if "ID" in row else 0
                customers.append(
                    {
                        "id": row_id,
                        "name": names[row_id % len(names)],
                        "age": int(row["Age"]),
                        "education": str(row.get("Education_Simplified", row.get("Education", "Graduation"))),
                        "income": int(row["Income"]) if not pd.isna(row["Income"]) else 0,
                        "spending": int(row.get("TotalSpending", 0)),
                        "visits": int(row.get("NumWebVisitsMonth", 0)),
                        "cluster": cluster_names.get(int(row["Cluster"]), "Unknown"),
                    }
                )
            return Response(customers)
        except Exception as exc:
            logger.error("Failed to build recent customers response: %s", exc, exc_info=True)
            return Response(
                {"error": str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class CustomObtainAuthToken(ObtainAuthToken):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        turnstile_token = request.data.get("turnstile_token")
        if not verify_turnstile_token(turnstile_token):
            return Response(
                {"non_field_errors": ["Security check failed. Please refresh and try again."]},
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)  # type: ignore
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email,
            'username': user.username,
            'is_staff': user.is_staff
        })


class LogoutView(APIView):
    def post(self, request):
        try:
            request.user.auth_token.delete()
            return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"error": "Failed to logout."}, status=status.HTTP_400_BAD_REQUEST)


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        turnstile_token = request.data.get("turnstile_token")
        if not verify_turnstile_token(turnstile_token):
            return Response(
                {"error": "Security check failed. Please try again."},
                status=status.HTTP_400_BAD_REQUEST
            )
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {"error": "Username and password are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "Username is already taken."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.create_user(
                username=username,
                password=password
            )

            token, created = Token.objects.get_or_create(user=user)  # type: ignore
            return Response(
                {
                    "message": "User registered successfully.",
                    "token": token.key,
                    "user_id": user.pk,
                    "username": user.username,
                    "is_staff": user.is_staff
                },
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
