from rest_framework import serializers


class PlaceNameSerializer(serializers.Serializer):
    place_name = serializers.CharField()
