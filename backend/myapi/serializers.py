from rest_framework import serializers


class PlaceNameSerializer(serializers.Serializer):
    place_name = serializers.CharField()
    place_bias = serializers.CharField(required=False)


class TwoPlaceDistanceSerializer(serializers.Serializer):
    place_from = serializers.CharField()
    place_to = serializers.CharField()
    mode = serializers.CharField()
