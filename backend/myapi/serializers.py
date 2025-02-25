from rest_framework import serializers


class PlaceNameSerializer(serializers.Serializer):
    place_name = serializers.CharField()
    place_bias = serializers.CharField(required=False)


class TwoPlaceDistanceSerializer(serializers.Serializer):
    place_from = serializers.CharField()
    place_to = serializers.CharField()
    mode = serializers.CharField()


class StartPointSerializer(serializers.Serializer):
    location = serializers.CharField(max_length=100)
    departureDateTime = serializers.DateTimeField()
    travelMethodToNext = serializers.CharField(max_length=50)


class ViaPointSerializer(serializers.Serializer):
    index = serializers.IntegerField()
    location = serializers.CharField(max_length=100)
    arrivalDateTime = serializers.DateTimeField(required=False)
    departureDateTime = serializers.DateTimeField(required=False)
    priority = serializers.CharField(max_length=10, required=False)
    travelMethodToNext = serializers.CharField(max_length=50, required=False)


class FinalPointSerializer(serializers.Serializer):
    location = serializers.CharField(max_length=100)
    arrivalDateTime = serializers.DateTimeField()


class ScheduleSerializer(serializers.Serializer):
    startPoint = StartPointSerializer()
    viaPoints = ViaPointSerializer(many=True)
    finalPoint = FinalPointSerializer()


class ScheduleAdjustSerializer(serializers.Serializer):
    schedule = ScheduleSerializer()
    now_time = serializers.DateTimeField()
    passed_index = serializers.IntegerField()
    delete = serializers.BooleanField()