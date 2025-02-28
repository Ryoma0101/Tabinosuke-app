from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from datetime import timedelta
from django.utils import timezone
from .models import StartPoint, FinalPoint, TravelPlan, ViaPoint


class ModelTests(TestCase):
    def setUp(self):
        # テストデータの作成
        self.start_point = StartPoint.objects.create(
            location="東京駅",
            departure_datetime=timezone.now(),
            travel_method_to_next="電車"
        )

        self.final_point = FinalPoint.objects.create(
            location="大阪駅",
            arrival_datetime=timezone.now() + timedelta(hours=3)
        )

        self.travel_plan = TravelPlan.objects.create(
            plan_name="東京-大阪旅行",
            start_point=self.start_point,
            final_point=self.final_point
        )

        self.via_point = ViaPoint.objects.create(
            index=1,
            plan=self.travel_plan,
            location="名古屋駅",
            arrival_datetime=timezone.now() + timedelta(hours=1),
            priority="high",
            departure_datetime=timezone.now() + timedelta(hours=2),
            travel_method_to_next="電車"
        )

    def test_start_point_creation(self):
        self.assertEqual(self.start_point.location, "東京駅")
        self.assertEqual(self.start_point.travel_method_to_next, "電車")

    def test_final_point_creation(self):
        self.assertEqual(self.final_point.location, "大阪駅")

    def test_travel_plan_creation(self):
        self.assertEqual(self.travel_plan.plan_name, "東京-大阪旅行")
        self.assertEqual(self.travel_plan.start_point, self.start_point)
        self.assertEqual(self.travel_plan.final_point, self.final_point)

    def test_via_point_creation(self):
        self.assertEqual(self.via_point.location, "名古屋駅")
        self.assertEqual(self.via_point.index, 1)
        self.assertEqual(self.via_point.priority, "high")
        self.assertEqual(self.via_point.plan, self.travel_plan)


class APITests(TestCase):
    def setUp(self):
        self.client = Client()
        self.now = timezone.now()

        # テストデータの作成
        self.start_point = StartPoint.objects.create(
            location="東京駅",
            departure_datetime=self.now,
            travel_method_to_next="電車"
        )

        self.final_point = FinalPoint.objects.create(
            location="大阪駅",
            arrival_datetime=self.now + timedelta(hours=3)
        )

        self.travel_plan = TravelPlan.objects.create(
            plan_name="東京-大阪旅行",
            start_point=self.start_point,
            final_point=self.final_point
        )

    def test_place_name_api(self):
        data = {
            "place_name": "東京駅",
        }
        response = self.client.post(
            reverse('placename'),
            data,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_two_place_distance_api(self):
        data = {
            "place_from": "東京駅",
            "place_to": "大阪駅",
            "mode": "driving"
        }
        response = self.client.post(
            reverse('distance'),
            data,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_travel_plan_create_api(self):
        arrival_time = self.now + timedelta(hours=2)
        departure_time = self.now + timedelta(hours=3)
        final_arrival = self.now + timedelta(hours=5)

        data = {
            "plan_name": "新規旅行プラン",
            "start_point": {
                "location": "札幌駅",
                "departure_datetime": self.now.isoformat(),
                "travel_method_to_next": "飛行機"
            },
            "final_point": {
                "location": "福岡駅",
                "arrival_datetime": final_arrival.isoformat()
            },
            "via_points": [{
                "index": 1,
                "location": "東京駅",
                "arrival_datetime": arrival_time.isoformat(),
                "priority": "high",
                "departure_datetime": departure_time.isoformat(),
                "travel_method_to_next": "飛行機"
            }]
        }
        response = self.client.post(
            reverse('travel_plan'),
            data,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_schedule_adjustment_api(self):
        via_point1 = ViaPoint.objects.create(
            index=1,
            plan=self.travel_plan,
            location="名古屋駅",
            arrival_datetime=self.now + timedelta(hours=1),
            priority="high",
            departure_datetime=self.now + timedelta(hours=2),
            travel_method_to_next="電車"
        )

        via_point2 = ViaPoint.objects.create(
            index=2,
            plan=self.travel_plan,
            location="京都駅",
            arrival_datetime=self.now + timedelta(hours=2),
            priority="medium",
            departure_datetime=self.now + timedelta(hours=2, minutes=30),
            travel_method_to_next="電車"
        )

        start_time = self.start_point.departure_datetime.isoformat()
        final_time = self.final_point.arrival_datetime.isoformat()
        via1_arrival = via_point1.arrival_datetime.isoformat()
        via1_departure = via_point1.departure_datetime.isoformat()
        via2_arrival = via_point2.arrival_datetime.isoformat()
        via2_departure = via_point2.departure_datetime.isoformat()

        data = {
            "schedule": {
                "id": str(self.travel_plan.id),
                "plan_name": self.travel_plan.plan_name,
                "start_point": {
                    "location": self.start_point.location,
                    "departure_datetime": start_time,
                    "travel_method_to_next": self.start_point.travel_method_to_next
                },
                "final_point": {
                    "location": self.final_point.location,
                    "arrival_datetime": final_time
                },
                "via_points": [{
                    "index": via_point1.index,
                    "location": via_point1.location,
                    "arrival_datetime": via1_arrival,
                    "priority": via_point1.priority,
                    "departure_datetime": via1_departure,
                    "travel_method_to_next": via_point1.travel_method_to_next
                }, {
                    "index": via_point2.index,
                    "location": via_point2.location,
                    "arrival_datetime": via2_arrival,
                    "priority": via_point2.priority,
                    "departure_datetime": via2_departure,
                    "travel_method_to_next": via_point2.travel_method_to_next
                }]
            },
            "passed_index": 0,
            "now_time": (self.now + timedelta(minutes=30)).isoformat(),
            "delete": False
        }
        response = self.client.post(
            reverse('schedule'),
            data,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_schedule_adjustment_by_id_api(self):
        # Setup test data
        via_point1 = ViaPoint.objects.create(
            index=1,
            plan=self.travel_plan,
            location="名古屋駅",
            arrival_datetime=self.now + timedelta(hours=1),
            priority="high",
            departure_datetime=self.now + timedelta(hours=2),
            travel_method_to_next="電車"
        )

        via_point2 = ViaPoint.objects.create(
            index=2,
            plan=self.travel_plan,
            location="京都駅",
            arrival_datetime=self.now + timedelta(hours=2),
            priority="medium",
            departure_datetime=self.now + timedelta(hours=2, minutes=30),
            travel_method_to_next="電車"
        )

        # Prepare request data
        data = {
            "id": str(self.travel_plan.id),
            "passed_index": 0,
            "now_time": (self.now + timedelta(minutes=30)).isoformat()
        }

        # Send POST request to the schedule adjustment by ID endpoint
        response = self.client.post(
            reverse('schedule_by_id'),
            data,
            content_type='application/json'
        )

        # Check the response status code
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify the response contains the expected travel plan ID
        self.assertEqual(str(response.data["id"]), str(self.travel_plan.id))

        # Remove unused variables
        del via_point1, via_point2

    def test_load_api(self):
        url = reverse("load", kwargs={"uuid": self.travel_plan.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
