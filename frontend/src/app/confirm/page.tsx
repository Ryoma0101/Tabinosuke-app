"use client";
import React, { useState } from "react";
import Day from "@/components/Atoms/Day";
import Header from "@/components/Atoms/Header";
import Schedule from "@/components/Atoms/Schedule";
import ScheduleTransportation from "@/components/Atoms/ScheculeTransportation";
import { Button } from "@/components/ui/button";
import CurrentTimeLine from "@/components/Atoms/currentTineLine";

export default function ConfirmPage() {
  const [activeSchedule, setActiveSchedule] = useState<string | null>(null);
  const [timeLineColor, setTimeLineColor] = useState<"green" | "red">("green");

  // 現在地の位置に基づいて線の色を更新する関数
  const updateTimeLineColor = (scheduleId: string) => {
    // 現在地より上のスケジュールのID一覧
    const schedulesBefore = ["schedule1"];
    // 現在地より下のスケジュールのID一覧
    const schedulesAfter = ["schedule2", "schedule3", "schedule4"];

    if (schedulesBefore.includes(scheduleId)) {
      setTimeLineColor("green");
    } else if (schedulesAfter.includes(scheduleId)) {
      setTimeLineColor("red");
    }
  };

  // スケジュールクリック時のハンドラー
  const handleScheduleClick = (scheduleId: string) => {
    setActiveSchedule(scheduleId);
    updateTimeLineColor(scheduleId);
  };

  return (
    <main className="min-h-screen flex justify-center items-center bg-gray-100">
      <div>
      <div className="w-full max-w-[768px] mx-auto bg-white px-9 py-4">
        <div className="flex flex-col gap-11">
          <Header text="スケジュール確認" />
          <Day day={1} date={new Date(2025, 1, 25)} />
          <div className="flex flex-col gap-11 items-center">
            <div onClick={() => handleScheduleClick("schedule1")}>
              <Schedule
                time={new Date("2024-02-20T10:30:00")}
                route="東京駅"
                priority="低"
                showCurrent={activeSchedule === "schedule1"}
                showPriority={false}
              />
            </div>
            <ScheduleTransportation transport="電車" />
            <CurrentTimeLine lineColor={timeLineColor} />
            <div onClick={() => handleScheduleClick("schedule2")}>
              <Schedule
                time={new Date("2024-02-20T11:00:00")}
                endTime={new Date("2024-02-20T11:30:00")}
                priority="中"
                route="横浜駅"
                showCurrent={activeSchedule === "schedule2"}
                showPriority={true}
              />
            </div>
            <ScheduleTransportation transport="徒歩" />
            <div onClick={() => handleScheduleClick("schedule3")}>
              <Schedule
                time={new Date("2024-02-20T12:00:00")}
                endTime={new Date("2024-02-20T14:00:00")}
                priority="高"
                route="みなとみらい"
                showCurrent={activeSchedule === "schedule3"}
                showPriority={true}
              />
            </div>
            <ScheduleTransportation transport="徒歩" />
            <div onClick={() => handleScheduleClick("schedule4")}>
              <Schedule
                time={new Date("2024-02-20T14:30:00")}
                route="コスモパニック"
                priority=""
                showCurrent={activeSchedule === "schedule4"}
                showPriority={false}
              />
            </div>
          </div>
          <div className="p-4 flex flex-row gap-10">
            <Button variant="outline" className="w-[136px]">
              修正する
            </Button>
            <Button className="w-[136px] bg-[#3f3f46]">作成する</Button>
          </div>
        </div>
        </div>
      </div>
    </main>
  );
}
