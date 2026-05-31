from django.urls import path
from . import views

urlpatterns = [
    path('predict/', views.PredictClusterView.as_view(), name='predict'),
]