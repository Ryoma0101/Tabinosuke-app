from django.contrib import admin
from .models import TravelPlan, StartPoint, FinalPoint, ViaPoint

admin.site.register(TravelPlan)
admin.site.register(StartPoint)
admin.site.register(FinalPoint)
admin.site.register(ViaPoint)
