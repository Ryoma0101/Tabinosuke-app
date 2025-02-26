import React from "react";
import Day from "@/components/Atoms/Day";
import Header from "@/components/Atoms/Header";
import Schedule from "@/components/Atoms/Schedule";
import ScheduleTransportation from "@/components/Atoms/ScheculeTransportation";
import { Button } from "@/components/ui/button";
import CurrentTimeLine from "@/components/Atoms/currentTineLine";

export default function ConfirmPage() {
  return (
    <main>
      <div className="min-h-screen bg-gray-100 flex justify-center">
        <div className="w-full max-w-[768px] mx-auto bg-white px-9 py-4">
          <div className="flex flex-col gap-11">
            <Header text="スケジュール確認" />
            <Day day={1} date={new Date(2025, 1, 25)} />
            <div className="flex flex-col gap-11">
              <Schedule
                time={new Date("2024-02-20T10:30:00")}
                // endTime={new Date("2024-02-20T11:30:00")}
                route="東京駅"
                showCurrent={false}
                showPriority={false}
              />
              <ScheduleTransportation
                time={new Date("2024-02-20T10:30:00")}
                transport="電車"
              />
              <CurrentTimeLine lineColor="green" />
              <Schedule
                time={new Date("2024-02-20T11:00:00")}
                endTime={new Date("2024-02-20T11:30:00")}
                priority="中"
                route="横浜駅"
                showCurrent={true}
                showPriority={true}
              />
              <ScheduleTransportation
                time={new Date("2024-02-20T11:30:00")}
                transport="徒歩"
              />
              <Schedule
                time={new Date("2024-02-20T12:00:00")}
                endTime={new Date("2024-02-20T14:00:00")}
                priority="高"
                route="みなとみらい"
                showCurrent={false}
                showPriority={true}
              />
              <ScheduleTransportation
                time={new Date("2024-02-20T14:00:00")}
                transport="徒歩"
              />
              <Schedule
                time={new Date("2024-02-20T14:30:00")}
                route="コスモワールド"
                showCurrent={false}
                showPriority={false}
              />
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
