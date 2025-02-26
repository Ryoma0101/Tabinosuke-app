import React from "react";
import Day from "@/components/Atoms/Day";
import Header from "@/components/Atoms/Header";
import Schedule from "@/components/Atoms/Schedule";

export default function ConfirmPage() {
  return (
    <main>
      <div className="min-h-screen bg-gray-100 flex justify-center">
        <div className="w-full max-w-[768px] mx-auto bg-white px-6 py-4">
          <div className="flex flex-col">
            <Header text="スケジュール確認" />
            <Day day={1} date={new Date(2025, 1, 25)} />
            <div className="flex flex-col gap-11">
              <Schedule
                time={"AM 5:00"}
                route={"高須クリニック"}
                showCurrent={false}
                showPriority={false}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
