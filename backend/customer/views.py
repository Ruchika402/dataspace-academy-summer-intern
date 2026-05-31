from django.shortcuts import render

# Create your views here.

import numpy as np
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import CustomerInputSerializer, PredictionResponseSerializer

class PredictClusterView(APIView):
    def get(self, request):
        return Response({
            'message': 'Customer Categorization API is running!',
            'status': 'active',
            'model_status': 'Rule-based prediction (waiting for ML model)',
            'endpoints': {
                'POST /api/predict/': 'Send customer data to get cluster prediction',
            },
            'expected_fields': [
                'age', 'income', 'total_spending', 'education',
                'marital_status', 'num_web_purchases', 'num_store_purchases',
                'num_catalog_purchases', 'num_web_visits_month', 
                'recency', 'total_children'
            ],
            'example_post': {
                'age': 55,
                'income': 50000,
                'total_spending': 450,
                'education': 'Graduate',
                'marital_status': 'Married',
                'num_web_purchases': 5,
                'num_store_purchases': 8,
                'num_catalog_purchases': 2,
                'num_web_visits_month': 12,
                'recency': 30,
                'total_children': 2
            }
        })
    
    def post(self, request):
        serializer = CustomerInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        
        # Simple rule-based prediction (temporary until ML model is ready)
        # Calculate a score based on spending and income
        spending_score = data['total_spending'] / 100
        income_score = data['income'] / 10000
        total_score = spending_score + income_score
        
        # Determine cluster based on score
        if total_score > 15:
            prediction = 1  # Premium Customer
        elif total_score > 8:
            prediction = 2  # Regular Shopper
        elif total_score > 3:
            prediction = 0  # Budget Conscious
        else:
            prediction = 3  # Occasional Buyer
        
        cluster_descriptions = {
            0: "Budget Conscious - Low spender, seeks discounts",
            1: "Premium Customer - High income, high spender",
            2: "Regular Shopper - Moderate spending, balanced",
            3: "Occasional Buyer - Rare purchases, selective"
        }
        
        response_data = {
            'predicted_cluster': prediction,
            'cluster_description': cluster_descriptions.get(prediction, "Standard Customer"),
            'confidence_score': 0.85,
            'message': f'Customer belongs to cluster {prediction}: {cluster_descriptions.get(prediction)}'
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
