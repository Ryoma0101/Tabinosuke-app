import os
from dotenv import load_dotenv
import requests
from datetime import timedelta, datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .serializers import PlaceNameSerializer, TravelPlanSerializer
from .serializers import TwoPlaceDistanceSerializer
from .serializers import ScheduleAdjustSerializer, ViaPointSerializer
from .serializers import ScheduleAdjustByIdSerializer
from .models import TravelPlan, ViaPoint
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


class TravelPlanCreateView(APIView):
    def post(self, request):
        serializer = TravelPlanSerializer(data=request.data)

        if serializer.is_valid():
            travel_plan = serializer.save()
            return Response({"id": travel_plan.id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ScheduleAdjustmentView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = ScheduleAdjustSerializer(data=request.data)
        if serializer.is_valid():
            schedule = serializer.validated_data['schedule']
            passed_index = serializer.validated_data['passed_index']
            now_time = serializer.validated_data['now_time']
            not_passed_index = passed_index + 1

            # locate_returnが見つからない場合の処理を追加
            locate_return = next((schedule for schedule in schedule["via_points"] if schedule["index"] == not_passed_index), None)
            if not locate_return:
                return Response({"error": "Invalid index for locate_return"}, status=status.HTTP_400_BAD_REQUEST)

            delay = now_time - locate_return["arrival_datetime"]
            if delay.total_seconds() <= 0:
                # 遅延がない場合でも、スケジュール情報を含むレスポンスを返す
                response_data = {
                    "schedule": schedule,
                    "shortened_time": 0,
                    "remaining_delay": 0,
                    "delay": delay.total_seconds()
                }
                return Response(response_data, status=status.HTTP_200_OK)

            # passed_index以降のviaPointsを取得
            remaining_points = [p for p in schedule["via_points"] if p.index > passed_index]

            # 各ポイントの持ち時間を計算
            point_durations = []
            for point in remaining_points:
                arrival_datetime = point.arrival_datetime
                departure_datetime = point.departure_datetime
                duration = departure_datetime - arrival_datetime
                point_durations.append({
                    "index": point.index,
                    "duration": duration,
                    "priority": getattr(point, "priority", 1),
                    "max_delay": duration.total_seconds() * 0.3  # 30%制限
                })

            # 優先度でグループ化
            priority_groups = {}
            for pd in point_durations:
                if pd["priority"] not in priority_groups:
                    priority_groups[pd["priority"]] = []
                priority_groups[pd["priority"]].append(pd)

            # 遅延を分配
            total_delay = delay.total_seconds()
            original_delay = total_delay  # 元のdelayを保存
            separated_delay = {}

            # 優先度の低い順に遅延を分配
            for priority in sorted(priority_groups.keys(), reverse=True):
                group = priority_groups[priority]
                group_delay = total_delay / len(remaining_points)

                for point in group:
                    # 各ポイントに割り当てる遅延時間を計算
                    allocated_delay = min(group_delay, point["max_delay"])
                    # 滞在時間から遅延時間を引く (マイナスの遅延 = 滞在時間の短縮)
                    separated_delay[point["index"]] = -allocated_delay
                    total_delay -= allocated_delay

                    # スケジュールの更新
                    target_point = [p for p in remaining_points if p.index == point["index"]][0]
                    new_departure = target_point.departure_datetime - timedelta(seconds=allocated_delay)
                    target_point.departure_datetime = new_departure

            # 修正したスケジュールを作成
            fixed_schedule = schedule.copy()
            fixed_schedule["via_points"] = [p for p in schedule["via_points"] if p.index <= passed_index] + remaining_points

            # 短縮時間と余った遅延時間を計算
            total_shortened = sum([-delay for delay in separated_delay.values()])
            remaining_delay = total_delay if total_delay > 0 else 0

            response_data = {
                "schedule": fixed_schedule,
                "shortened_time": total_shortened,
                "remaining_delay": remaining_delay,
                "delay": original_delay
            }

            return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ScheduleAdjustByIdView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = ScheduleAdjustByIdSerializer(data=request.data)
        if serializer.is_valid():
            id = serializer.validated_data['id']

            # TravelPlanを取得
            travel_plan = get_object_or_404(TravelPlan, id=id)
            travel_plan_data = TravelPlanSerializer(travel_plan).data

            # スケジュールデータを取得
            schedule = travel_plan_data
            via_points = ViaPoint.objects.filter(plan=travel_plan).all()
            schedule["via_points"] = list(via_points)
            passed_index = request.data.get('passed_index', 0)
            now_time_str = request.data.get('now_time')
            not_passed_index = passed_index + 1

            # now_timeをdatetimeに変換
            try:
                now_time = datetime.fromisoformat(now_time_str)
            except (TypeError, ValueError):
                return Response({"error": "Invalid now_time format"}, status=status.HTTP_400_BAD_REQUEST)

            # locate_returnが見つからない場合の処理を追加
            locate_return = next((vp for vp in schedule["via_points"] if vp.index == not_passed_index), None)
            if not locate_return:
                return Response({"error": "Invalid index for locate_return"}, status=status.HTTP_400_BAD_REQUEST)

            # arrival_datetimeをdatetimeに変換
            arrival_datetime = locate_return.arrival_datetime

            delay = now_time - arrival_datetime
            if delay.total_seconds() <= 0:
                return Response({"id": travel_plan.id}, status=status.HTTP_200_OK)

            # passed_index以降のviaPointsを取得
            remaining_points = [p for p in schedule["via_points"] if p.index > passed_index]

            # 各ポイントの持ち時間を計算
            point_durations = []
            for point in remaining_points:
                arrival_datetime = point.arrival_datetime
                departure_datetime = point.departure_datetime
                duration = departure_datetime - arrival_datetime
                point_durations.append({
                    "index": point.index,
                    "duration": duration,
                    "priority": getattr(point, "priority", 1),
                    "max_delay": duration.total_seconds() * 0.3  # 30%制限
                })

            # 優先度でグループ化
            priority_groups = {}
            for pd in point_durations:
                if pd["priority"] not in priority_groups:
                    priority_groups[pd["priority"]] = []
                priority_groups[pd["priority"]].append(pd)

            # 遅延を分配
            total_delay = delay.total_seconds()
            separated_delay = {}

            # 優先度の低い順に遅延を分配
            for priority in sorted(priority_groups.keys(), reverse=True):
                group = priority_groups[priority]
                group_delay = total_delay / len(remaining_points)

                for point in group:
                    # 各ポイントに割り当てる遅延時間を計算
                    allocated_delay = min(group_delay, point["max_delay"])
                    # 滞在時間から遅延時間を引く (マイナスの遅延 = 滞在時間の短縮)
                    separated_delay[point["index"]] = -allocated_delay
                    total_delay -= allocated_delay

                    # スケジュールの更新
                    target_point = [p for p in remaining_points if p.index == point["index"]][0]
                    new_departure = target_point.departure_datetime - timedelta(seconds=allocated_delay)
                    target_point.departure_datetime = new_departure

            # 修正したスケジュールを作成
            fixed_schedule = schedule.copy()
            fixed_schedule["via_points"] = [p for p in schedule["via_points"] if p.index <= passed_index] + remaining_points

            # データベースに保存
            for vp_data in fixed_schedule["via_points"]:
                vp_instance = get_object_or_404(ViaPoint, id=vp_data.id)
                vp_instance.departure_datetime = vp_data.departure_datetime
                vp_instance.save()

            # Sort via_points by arrival_datetime
            sorted_via_points = sorted(via_points, key=lambda vp: vp.arrival_datetime)

            # Reassign index based on sorted order
            for new_index, vp in enumerate(sorted_via_points, start=1):
                vp.index = new_index
                vp.save()

            # Return the id of the updated TravelPlan
            return Response({"id": travel_plan.id}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class HealthCheckView(APIView):
    def get(self, request, *args, **kwargs):
        return Response({"status": "healthy"})


class LoadView(APIView):
    def get(self, request, uuid, *args, **kwargs):
        # `uuid` をそのまま使用して `get_object_or_404()` を実行
        plan = get_object_or_404(TravelPlan, id=uuid)
        travel_serializer = TravelPlanSerializer(plan)

        # `ViaPoint` を取得（`plan` をキーにして検索し、`index` 順に並べる）
        via_points = ViaPoint.objects.filter(plan=plan).order_by("index")

        # `ViaPoint` をシリアライズ
        via_serializer = ViaPointSerializer(via_points, many=True)

        # `via_points` を `travel_serializer` のデータに追加
        plan_data = travel_serializer.data
        plan_data["via_points"] = via_serializer.data  # ✅ ここで追加

        return Response(plan_data, status=status.HTTP_200_OK)
