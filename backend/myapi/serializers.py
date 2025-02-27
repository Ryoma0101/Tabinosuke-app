from rest_framework import serializers
from .models import TravelPlan, StartPoint, FinalPoint, ViaPoint


class PlaceNameSerializer(serializers.Serializer):
    place_name = serializers.CharField()
    place_bias = serializers.CharField(required=False)


class TwoPlaceDistanceSerializer(serializers.Serializer):
    place_from = serializers.CharField()
    place_to = serializers.CharField()
    mode = serializers.CharField()


class StartPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = StartPoint
        fields = "__all__"


class FinalPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinalPoint
        fields = "__all__"


class ViaPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = ViaPoint
        fields = "__all__"


class TravelPlanSerializer(serializers.ModelSerializer):
    start_point = StartPointSerializer()
    final_point = FinalPointSerializer()
    via_points = ViaPointSerializer()

    class Meta:
        model = TravelPlan
        fields = "__all__"
