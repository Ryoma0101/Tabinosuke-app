import os
from dotenv import load_dotenv
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import PlaceNameSerializer
load_dotenv()


class PlaceNameView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = PlaceNameSerializer(data=request.data)
        if serializer.is_valid():
            PlaceName = serializer.validated_data['place_name']
            
            if not place_name:
                return Response({"error": "place_name is required"}, status=status.HTTP_400_BAD_REQUEST)
            # Places APIのURL
            places_api_url = "https://places.googleapis.com/v1/places:searchText"
            
            # Google API Key
            google_api_key = os.getenv('google_api_key')
            
            headers = {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": google_api_key,
                "X-Goog-FieldMask": "*"
            }
            
            query = {
                "textQuery": PlaceName,
                "pageSize": 5
            }
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
            "X-Goog-FieldMask": "*"
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