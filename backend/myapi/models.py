import uuid
from django.db import models


# 旅行プランの開始地点
class StartPoint(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  # UUID を主キーにする
    location = models.CharField(max_length=255)
    departure_datetime = models.DateTimeField()
    travel_method_to_next = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.location} (出発: {self.departure_datetime})"


# 旅行プランの最終地点
class FinalPoint(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    location = models.CharField(max_length=255)
    arrival_datetime = models.DateTimeField()

    def __str__(self):
        return f"{self.location} (到着: {self.arrival_datetime})"


# 旅行プラン全体
class TravelPlan(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  # 旅行プランごとに UUID を設定
    plan_name = models.CharField(max_length=255)
    start_point = models.OneToOneField(StartPoint, on_delete=models.CASCADE)
    final_point = models.OneToOneField(FinalPoint, on_delete=models.CASCADE)

    def __str__(self):
        return self.plan_name


# 経由地点 (可変長リスト)
class ViaPoint(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    plan = models.ForeignKey(TravelPlan, on_delete=models.CASCADE, related_name="via_points")
    location = models.CharField(max_length=255)
    arrival_datetime = models.DateTimeField()
    priority = models.CharField(max_length=50)
    departure_datetime = models.DateTimeField()
    travel_method_to_next = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.location} (到着: {self.arrival_datetime}, 出発: {self.departure_datetime})"
