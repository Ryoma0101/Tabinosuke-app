from django.urls import path
from .views import PlaceNameView
from .views import TwoPlaceDistanceView
from .views import ScheduleAdjustmentView
from .views import HealthCheckView

urlpatterns = [
    path('search-placename/', PlaceNameView.as_view(), name='placename'),
    path('two-place-distance/', TwoPlaceDistanceView.as_view(), name='distance'),
    path('schedule-adjustment/', ScheduleAdjustmentView.as_view(), name='schedule'),
    path('api/health/', HealthCheckView.as_view(), name='health_check')
]