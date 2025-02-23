import os
import json
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
                place_data = {}
                for index, place in enumerate(places_list, start=1):
                    place_name = place["displayName"]["text"]  # 場所の名前
                    place_address = place.get("formattedAddress", "No address available")  # 住所（無い場合はデフォルト値）

                    place_data[index] = {"name": place_name, "address": place_address}

                return Response(place_data, status=response.status_code)

            except requests.exceptions.RequestException as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    def get(self, request, *args, **kwargs):
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
            "X-Goog-FieldMask": "places.displayName,places.formattedAddress"
        }

        query = {
            "textQuery": place_name,
            "pageSize": 5
        }

        try:
            # Places APIへリクエスト送信
            response = requests.post(places_api_url, headers=headers, json=query)
            response_data = response.json()

            # レスポンスに "places" キーがあるかチェック
            if "places" not in response_data:
                return Response({"error": "No places found"}, status=status.HTTP_404_NOT_FOUND)

            places_list = response_data["places"]
            
            place_data = {}
            for index, place in enumerate(places_list, start=1):
                place_name = place["displayName"]["text"]  # 場所の名前
                place_address = place.get("formattedAddress", "No address available")  # 住所（無い場合はデフォルト値）

                place_data[index] = {"name": place_name, "address": place_address}

            return Response(place_data, status=response.status_code)

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
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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