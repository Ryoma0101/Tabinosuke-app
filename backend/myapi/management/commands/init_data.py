from django.core.management.base import BaseCommand
from myapi.models import StartPoint, FinalPoint, TravelPlan, ViaPoint
from datetime import datetime
import uuid

class Command(BaseCommand):
    help = 'Initialize default data with fixed IDs'

    def handle(self, *args, **kwargs):
        # 固定IDを使用してデフォルトデータを作成
        start_point = StartPoint.objects.create(
            id=uuid.UUID('12345678-1234-5678-1234-567812345678'),
            location="ユニークいくぜ",
            departure_datetime=datetime.fromisoformat("2025-03-01T12:00:00"),
            travel_method_to_next="車"
        )

        final_point = FinalPoint.objects.create(
            id=uuid.UUID('87654321-4321-8765-4321-876543218765'),
            location="ユニークついたぜ",
            arrival_datetime=datetime.fromisoformat("2025-03-02T18:00:00")
        )

        travel_plan = TravelPlan.objects.create(
            id=uuid.UUID('11223344-5566-7788-99aa-bbccddeeff00'),
            plan_name="ユニーク",
            start_point=start_point,
            final_point=final_point
        )

        via_points_data = [
            {"id": uuid.UUID('11111111-1111-1111-1111-111111111111'), "index": 1, "location": "ユニーク1", "arrival_datetime": "2025-03-01T13:00:00", "priority": "高", "departure_datetime": "2025-03-01T20:00:00", "travel_method_to_next": "徒歩"},
            {"id": uuid.UUID('22222222-2222-2222-2222-222222222222'), "index": 2, "location": "ユニーク2", "arrival_datetime": "2025-03-01T21:00:00", "priority": "中", "departure_datetime": "2025-03-01T22:00:00", "travel_method_to_next": "公共交通機関"},
            {"id": uuid.UUID('33333333-3333-3333-3333-333333333333'), "index": 3, "location": "ユニーク3", "arrival_datetime": "2025-03-01T23:00:00", "priority": "中", "departure_datetime": "2025-03-02T00:00:00", "travel_method_to_next": "公共交通機関"},
            {"id": uuid.UUID('44444444-4444-4444-4444-444444444444'), "index": 4, "location": "ユニーク4", "arrival_datetime": "2025-03-02T15:00:00", "priority": "低", "departure_datetime": "2025-03-02T17:00:00", "travel_method_to_next": "自転車"}
        ]

        for via_point_data in via_points_data:
            ViaPoint.objects.create(plan=travel_plan, **via_point_data)

        self.stdout.write(self.style.SUCCESS('Successfully initialized default data with fixed IDs'))