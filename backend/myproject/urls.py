"""
URL configuration for myproject project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from django.http import JsonResponse

def health_check(request):
    return JsonResponse({"status": "healthy"})

def root_view(request):
    return JsonResponse({
        "name": "CustomerIQ API",
        "status": "online",
        "version": "1.0.0",
        "description": "AI-powered customer segmentation and prediction platform.",
        "team": "Threat Hunter",
        "organization": "DataSpace Academy",
        "institution": "B.P. Poddar Institute of Management and Technology (BPPIMT)",
        "program": "AI & Machine Learning Summer Internship 2026",
        "location": "Sector V, Kolkata, India",
        "maintainers": [
            "Debasis",
            "Ruchika",
            "Sadikul",
            "Rupsa",
            "Payel"
        ],
        "docs": {
            "health": "/health/",
            "api_index": "/api/",
            "frontend": "https://threathunter.vercel.app",
            "backend": "https://threathunter-api.onrender.com"
        },
        "message": "Welcome to CustomerIQ - Transforming customer data into actionable business insights."
    })

def custom_404_view(request, exception=None):
    return JsonResponse({
        "error": "Not Found",
        "message": "The requested API endpoint does not exist. Please refer to the root URL (/) for API documentation.",
        "status_code": 404
    }, status=404)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('customer.urls')),
    path('health', health_check),
    path('health/', health_check),
    path('', root_view, name='root-info'),
]

handler404 = 'myproject.urls.custom_404_view'
