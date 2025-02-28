from django.urls import path
from .views import PlaceNameView, TravelPlanCreateView
from .views import TwoPlaceDistanceView
from .views import ScheduleAdjustmentView
from .views import HealthCheckView, LoadView, ScheduleAdjustByIdView

urlpatterns = [
    path('search-placename/', PlaceNameView.as_view(), name='placename'),
    path('two-place-distance/', TwoPlaceDistanceView.as_view(), name='distance'),
    path('save/', TravelPlanCreateView.as_view(), name='travel_plan'),
    path('schedule-adjustment-old/', ScheduleAdjustmentView.as_view(), name='schedule'),
    path('schedule-adjustment/', ScheduleAdjustByIdView.as_view(), name='schedule_by_id'),
    path('api/health/', HealthCheckView.as_view(), name='health_check'),
    path('load/<uuid:uuid>/', LoadView.as_view(), name='load')
]
