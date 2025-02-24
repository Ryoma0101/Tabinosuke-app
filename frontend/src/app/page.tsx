import React from "react";
import { Input } from "../components/Atoms/Input/input";
import Header from "@/components/Atoms/Header";
import { Button } from "@/components/ui/button";
import TransportSelector from "@/components/Molecules/TransportSelector";
import Day from "@/components/Atoms/Day";
import Schedule from "@/components/Atoms/Schedule";
import DepartureCard from "@/components/Molecules/DepartureCard";
import DestinationCard from "@/components/Molecules/DestinationCard";
const jsonData = {
  time: "AM 5:00",
  priority: "高", // "低" または "中" も指定可能
  route: "高須クリニック",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-[768px] my-0 mx-[30px] bg-white">
        <Header text="計画" />
        <main>
          <div className="p-4 flex flex-row gap-10">
            <Button variant="outline" className="w-[136px]">
              修正する
            </Button>
            <Button className="w-[136px] bg-[#3f3f46]">作成する</Button>
          </div>
          <div className="p-6">
            <TransportSelector />
          </div>
          <div className="p-6 gap-6 flex flex-col">
            <DepartureCard
              title="出発地点"
              time="到着時間目安"
              location="場所"
            />
            <DestinationCard
              title="出発地点"
              time="到着時間目安"
              location="場所"
            />
          </div>
          <div className="p-6 gap-6 flex flex-col">
            <Schedule
              time={jsonData.time}
              priority={jsonData.priority}
              route={jsonData.route}
            />

            {/* 優先度のみ表示 */}
            <Schedule
              time={jsonData.time}
              priority={jsonData.priority}
              route={jsonData.route}
              showCurrent={false}
            />

            {/* 両方非表示 出発地点と最終地点*/}
            <Schedule
              time={jsonData.time}
              priority={jsonData.priority}
              route={jsonData.route}
              showCurrent={false}
              showPriority={false}
            />
          </div>
        </main>
        <Day day={1} date={new Date(2025, 1, 25)} />
        <div className="grid flex justify-center align-center">
          <Input type="text" placeholder="旅行プラン名" />
          <main></main>
        </div>
      </div>
    </div>
  );
}
