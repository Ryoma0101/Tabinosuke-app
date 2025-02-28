"use client";
import React from "react";
import Image from "next/image";

interface ScheduleProps {
  departure_datetime: Date;
  arrival_datetime?: Date;
  priority: "低" | "中" | "高";
  route: string;
  showCurrent?: boolean;
  showPriority?: boolean;
}

export default function Schedule({
  departure_datetime,
  arrival_datetime,
  priority,
  route,
  showCurrent = true,
  showPriority = true,
}: ScheduleProps) {
  // 時刻のフォーマット関数
  const formatTime = (date: Date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return "";
    }
    return date
      .toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace("午前", "AM ")
      .replace("午後", "PM ");
  };

  // 優先度に応じたテキストカラーを設定
  const priorityColor = {
    低: "text-green-500",
    中: "text-orange-500",
    高: "text-red-500",
  }[priority];

  return (
    <div className="flex justify-between items-center w-[330px] font-sans gap-[39px] p-0 m-0">
      <div className="flex flex-col items-center text-[13px] text-[#666666] font-normal leading-normal w-24 pl-2 whitespace-nowrap">
        {arrival_datetime && <div>{formatTime(arrival_datetime)}</div>}
        {arrival_datetime && departure_datetime && (
          <span className="inline-block transform rotate-90">~</span>
        )}
        {departure_datetime && <div>{formatTime(departure_datetime)}</div>}
      </div>

      <div className="flex flex-col flex-1 gap-3">
        <div className="flex items-center text-[13px]">
          <Image
            src="/icons/pin.svg"
            alt="Pin Icon"
            width={16}
            height={16}
            className="mr-1 flex-shrink-0"
          />
          <span className="whitespace-normal">{route}</span>
          {showCurrent && (
            <div className="flex justify-center items-center gap-2.5 bg-primary text-[var(--bg,#FAFAFA)] px-[4px] py-[2px] rounded text-[11px] ml-2">
              現在地
            </div>
          )}
        </div>

        {showPriority && (
          <div className="flex gap-3 m-0">
            <div className="text-[13px] text-black">
              優先度: <span className={priorityColor}>{priority}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
