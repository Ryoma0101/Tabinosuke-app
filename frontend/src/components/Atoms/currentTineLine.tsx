import React from "react";

interface CurrentTimeLineProps {
  lineColor: "red" | "green"; // 色の選択肢を型として定義
}

export default function CurrentTimeLine({ lineColor }: CurrentTimeLineProps) {
  // 色に応じたクラスを設定
  const lineColorClass = {
    red: "bg-red-500",
    green: "bg-green-500",
  }[lineColor];

  return (
    <div className="flex items-center w-full gap-4 px-6">
      <span className="text-[13px] text-gray-600 whitespace-nowrap">
        現在時刻
      </span>
      <div className={`h-[2px] max-w-56 flex-grow ${lineColorClass}`}></div>
    </div>
  );
}
