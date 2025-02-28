import React from "react";
import Schedule from "@/components/Atoms/Schedule";
import { Button } from "@/components/ui/button";

interface AlertProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function Alert({ onClose, onConfirm }: AlertProps) {

  return (
    <div className="flex w-full max-w-[327px] flex-col items-center gap-6 rounded border border-[#3F3F46] p-4 bg-white shadow-lg">
      <p className="font-sans text-[#3F3F46] text-[13px]">
        スケジュールが押しています。以下の滞在時間を短縮しますか？
      </p>
      <div>
        {/* <Schedule
          time={new Date("2024-02-20T10:30:00")}
          endTime={new Date("2024-02-20T11:30:00")}
          priority="低"
          route={"高須クリニック"}
          showCurrent={false}
        /> */}
      </div>
      <div className="flex w-full justify-between gap-4">
        <Button variant="outline" className="w-[136px]" onClick={onClose}>
          キャンセル
        </Button>
        <Button className="w-[136px] bg-[#3f3f46]" onClick={onConfirm}>
          短縮する
        </Button>
      </div>
    </div>
  );
}
