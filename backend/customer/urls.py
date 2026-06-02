from django.urls import path
from . import views

urlpatterns = [
    path('predict/', views.PredictClusterView.as_view(), name='predict'),
    path('dashboard/stats/', views.DashboardStatsView.as_view(), name='dashboard-stats'),
    path('segments/', views.SegmentStatsView.as_view(), name='segments'),
    path('customers/recent/', views.RecentCustomersView.as_view(), name='recent-customers'),
]