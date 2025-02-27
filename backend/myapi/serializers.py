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
    plan = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = ViaPoint
        fields = ["plan", "location", "arrival_datetime", "priority", "departure_datetime", "travel_method_to_next"]


class TravelPlanSerializer(serializers.ModelSerializer):
    start_point = StartPointSerializer()
    final_point = FinalPointSerializer()
    via_points = ViaPointSerializer(many=True)

    class Meta:
        model = TravelPlan
        fields = "__all__"
