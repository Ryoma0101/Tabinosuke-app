from django.urls import path
from .views import PlaceNameView, TravelPlanCreateView
from .views import TwoPlaceDistanceView

urlpatterns = [
    path('search-placename/', PlaceNameView.as_view(), name='placename'),
    path('two-place-distance/', TwoPlaceDistanceView.as_view(), name='distance'),
    path('save/', TravelPlanCreateView.as_view(), name='travel_plan')
]
