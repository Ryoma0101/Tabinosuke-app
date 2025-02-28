"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Day from "@/components/Atoms/Day";
import Header from "@/components/Atoms/Header";
import Schedule from "@/components/Atoms/Schedule";
import ScheduleTransportation from "@/components/Atoms/ScheculeTransportation";
import { Button } from "@/components/ui/button";
import CurrentTimeLine from "@/components/Atoms/currentTineLine";

interface ScheduleData {
  id: string;
  start_point: {
    id: string;
    location: string;
    departure_datetime: string;
    travel_method_to_next: string;
  };
  final_point: {
    id: string;
    location: string;
    arrival_datetime: string;
  };
  via_points: {
    index: number;
    plan: string;
    location: string;
    arrival_datetime: string;
    priority: string;
    departure_datetime: string;
    travel_method_to_next: string;
  }[];
  plan_name: string;
}

export default function ConfirmPage() {
  const searchParams = useSearchParams();
  const uuid = searchParams.get("uuid");

  const [activeSchedule, setActiveSchedule] = useState<string | null>(null);
  const [timeLineColor, setTimeLineColor] = useState<"green" | "red">("green");
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (uuid) {
      fetchScheduleData(uuid);
    }
  }, [uuid]);

  const fetchScheduleData = async (uuid: string) => {
    try {
      const response = await fetch(
        `https://two025-tabinosuke-dev.onrender.com/api/load/${uuid}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ScheduleData = await response.json();
      setScheduleData(data);
      setError(null);
    } catch (error) {
      console.error("データの取得に失敗しました", error);
      setError("データの取得に失敗しました。UUIDを確認してください。");
    }
  };

  const updateTimeLineColor = (scheduleId: string) => {
    const schedulesBefore = ["schedule1"];
    const schedulesAfter = ["schedule2", "schedule3", "schedule4"];

    if (schedulesBefore.includes(scheduleId)) {
      setTimeLineColor("green");
    } else if (schedulesAfter.includes(scheduleId)) {
      setTimeLineColor("red");
    }
  };

  const handleScheduleClick = (scheduleId: string) => {
    setActiveSchedule(scheduleId);
    updateTimeLineColor(scheduleId);
  };

  if (!scheduleData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        {error && <div className="text-red-500">{error}</div>}
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-[585.6px] mx-auto bg-white shadow-md rounded-lg px-8 py-6 gap-8">
        <Header text="スケジュール確認" />
        <Day day={1} date={new Date(2025, 1, 25)} />
        <div className="flex flex-col gap-11 items-center">
          <div onClick={() => handleScheduleClick("schedule1")}>
            <Schedule
              departure_datetime={new Date(scheduleData.start_point.departure_datetime)}
              route={scheduleData.start_point.location}
              priority="低"  // 適切な値に変更
              showCurrent={activeSchedule === "schedule1"}
              showPriority={false}
            />
          </div>
          <ScheduleTransportation transport={scheduleData.start_point.travel_method_to_next} />
          <CurrentTimeLine lineColor={timeLineColor} />
          {scheduleData.via_points.map((point, index) => (
            <React.Fragment key={point.index}>
              <div onClick={() => handleScheduleClick(`schedule${index + 2}`)}>
                <Schedule
                  arrival_datetime={new Date(point.arrival_datetime)}
                  departure_datetime={new Date(point.departure_datetime)}
                  priority={point.priority as "低" | "中" | "高"}
                  route={point.location}
                  showCurrent={activeSchedule === `schedule${index + 2}`}
                  showPriority={true}
                />
              </div>
              <ScheduleTransportation transport={point.travel_method_to_next} />
            </React.Fragment>
          ))}
          <div onClick={() => handleScheduleClick("scheduleFinal")}>
            <Schedule
              arrival_datetime={new Date(scheduleData.final_point.arrival_datetime)}
              route={scheduleData.final_point.location}
              priority="低"  // 適切な値に変更
              showCurrent={activeSchedule === "scheduleFinal"}
              showPriority={false}
            />
          </div>
        </div>
        <div className="p-4 flex flex-row gap-10">
          <Button variant="outline" className="w-[136px]">
            修正する
          </Button>
          <Button className="w-[136px] bg-[#3f3f46]">シェアする</Button>
        </div>
      </div>
    </main>
  );
}
