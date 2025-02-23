from django.urls import path
from .views import PlaceNameView

urlpatterns = [
    path('search-placename/', PlaceNameView.as_view(), name='placename'),
]