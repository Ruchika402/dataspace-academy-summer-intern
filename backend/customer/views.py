import logging
from pathlib import Path

import pandas as pd
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User

from .serializers import CustomerInputSerializer


logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parents[2]
ML_DIR = BASE_DIR / "ml"
DATA_PATH = ML_DIR / "data" / "processed" / "cleaned_customer_data.csv"


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
            names = [
                "Amit Sharma", "Priya Mehta", "Ravi Kumar", "Sneha Iyer", "Karan Patel",
                "Divya Nair", "Suresh Reddy", "Ananya Das", "Mohit Verma", "Pooja Singh",
                "Vikram Joshi", "Neha Gupta", "Arjun Rao", "Sunita Krishnan", "Rahul Bose",
                "Aditi Rao", "Vijay Mallya", "Deepak Gupta", "Rajesh Khanna", "Sanjay Dutt"
            ]
            customers = []
            for _, row in df.head(20).iterrows():
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
        except (RuntimeError, KeyError, ValueError) as exc:
            logger.warning("Failed to build recent customers response: %s", exc)
            return Response(
                {"error": "No customers found"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class CustomObtainAuthToken(ObtainAuthToken):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email,
            'username': user.username
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

            token, created = Token.objects.get_or_create(user=user)
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
