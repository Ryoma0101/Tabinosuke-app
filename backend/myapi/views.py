import os
import json
from dotenv import load_dotenv
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import PlaceNameSerializer
from .serializers import TwoPlaceDistanceSerializer
from .serializers import ScheduleAdjustSerializer
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
                "X-Goog-FieldMask": "places.displayName,places.location,places.formattedAddress",
                "Content-Language": "ja"
            }
            
            query = {
                "textQuery": PlaceName,
                "pageSize": 5,
                "languageCode": 'ja',
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
            "X-Goog-FieldMask": "places.displayName,places.formattedAddress",
            "Content-Language": "ja"
        }

        query = {
            "textQuery": place_name,
            "pageSize": 5,
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
                place_name = place["displayName"]["text"]
                place_address = place.get("formattedAddress", "No address available")

                place_data[index] = {"name": place_name, "address": place_address}

            return Response(place_data, status=response.status_code)

        except requests.exceptions.RequestException as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TwoPlaceDistanceView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = TwoPlaceDistanceSerializer(data=request.data)
        if serializer.is_valid():
            place_from = serializer.validated_data['place_from']
            place_to = serializer.validated_data['place_to']
            mode = serializer.validated_data.get('mode', 'driving')  # デフォルトは車移動

            distance_data = self.get_distance(place_from, place_to, mode)
            if 'error' in distance_data:
                return Response(distance_data, status=status.HTTP_400_BAD_REQUEST)
            
            return Response(distance_data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, *args, **kwargs):
        place_from = request.GET.get("place_from")
        place_to = request.GET.get("place_to")
        mode = request.GET.get("mode", "driving")

        if not place_from or not place_to:
            return Response({"error": "Both place_from and place_to are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        distance_data = self.get_distance(place_from, place_to, mode)
        if 'error' in distance_data:
            return Response(distance_data, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(distance_data, status=status.HTTP_200_OK)
    
    def get_distance(self, origin, destination, mode):
        google_api_key = os.getenv("google_api_key")
        distance_matrix_url = "https://maps.googleapis.com/maps/api/distancematrix/json"

        params = {
            "origins": origin,
            "destinations": destination,
            "mode": mode,
            "key": google_api_key
        }

        try:
            response = requests.get(distance_matrix_url, params=params)
            data = response.json()

            if data.get("status") != "OK":
                return {"error": "Failed to fetch distance data", "details": data}
            
            elements = data["rows"][0]["elements"][0]
            if elements.get("status") != "OK":
                return {"error": "Invalid locations", "details": elements}
            
            return {
                "origin": origin,
                "destination": destination,
                "mode": mode,
                "distance": elements["distance"]["text"],
                "duration": elements["duration"]["text"],
            }
        except requests.exceptions.RequestException as e:
            return {"error": str(e)}


class ScheduleAdjustmentView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = ScheduleAdjustSerializer(data=request.data)
        if serializer.is_valid():
            schedule = serializer.validated_data['schedule']
            locate_return = [schedule for schedule in schedule["viaPoints"] if schedule["index"] == 1]
            
            return Response(locate_return, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        