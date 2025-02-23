from rest_framework import serializers


class PlaceNameSerializer(serializers.Serializer):
    place_name = serializers.CharField()
    place_bias = serializers.CharField()


class TwoPlaceDistanceSerializer(serializers.Serializer):
    place_lat_from = serializers.FloatField()
    place_lng_from = serializers.FloatField()
    place_lat_into = serializers.FloatField()
    place_lng_into = serializers.FloatField()
