import os
from dotenv import load_dotenv
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import PlaceNameSerializer
from .serializers import TwoPlaceDistanceSerializer
load_dotenv()


class PlaceNameView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = PlaceNameSerializer(data=request.data)
        if serializer.is_valid():
            PlaceName = serializer.validated_data['place_name']
            PlaceBias = serializer.validated_data.get('place_bias', None)

            if not PlaceName:
                return Response({"error": "place_name is required"}, status=status.HTTP_400_BAD_REQUEST)
            
            BiasUse = bool(PlaceBias)
            
            # Places APIのURL
            places_api_url = "https://places.googleapis.com/v1/places:searchText"
            
            # Google API Key
            google_api_key = os.getenv('google_api_key')
            
            headers = {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": google_api_key,
                "X-Goog-FieldMask": "places.displayName,places.location"
            }
            
            query = {
                "textQuery": PlaceName,
                "pageSize": 5
            }

            if BiasUse:
                query["locationBias"] = PlaceBias
                
            try:
                # PlacesAPIへリクエスト送信
                response = requests.post(places_api_url, headers=headers, json=query)
                response_data = response.json()
                return Response(response_data, status=response.status_code)

            except requests.exceptions.RequestException as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, *args, **kwargs):
        # クエリパラメータから place_name を取得
        place_name = request.GET.get("place_name")

        if not place_name:
            return Response({"error": "place_name is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Places APIのURL
        places_api_url = "https://places.googleapis.com/v1/places:searchText"

        # Google API Key
        google_api_key = os.getenv("google_api_key")

        headers = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": google_api_key,
            "X-Goog-FieldMask": "places.displayName,places.location"
        }
        
        query = {
                "textQuery": place_name,
                "pageSize": 5
            }

        try:
            # Places APIへリクエスト送信
            response = requests.post(places_api_url, headers=headers, json=query)
            response_data = response.json()
            return Response(response_data, status=response.status_code)

        except requests.exceptions.RequestException as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TwoPlaceDistanceView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = TwoPlaceDistanceSerializer(data=request.data)
        if serializer.is_valid():
            PlaceLatFrom = serializer.validated_data['place_lat_from']
            PlaceLngFrom = serializer.validated_data['place_lng_from']
            PlaceLatInto = serializer.validated_data['place_lat_into']
            PlaceLngInto = serializer.validated_data['place_lng_into']
        data = {"PlaceLatFrom": PlaceLatFrom,
                "PlaceLngFrom": PlaceLngFrom,
                "PlaceLatInto": PlaceLatInto,
                "PlaceLngInto": PlaceLngInto}
        
        return Response(data, status=status.HTTP_200_OK)

    def get(self, request, *args, **kwargs):
        PlaceLatFrom = request.GET.get("place_lat_from")
        PlaceLngFrom = request.GET.get("place_lng_from")
        PlaceLatInto = request.GET.get("place_lat_into")
        PlaceLngInto = request.GET.get("place_lng_into")
    
        data = {"PlaceLatFrom": PlaceLatFrom,
                "PlaceLngFrom": PlaceLngFrom,
                "PlaceLatInto": PlaceLatInto,
                "PlaceLngInto": PlaceLngInto}
        
        return Response(data, status=status.HTTP_200_OK)