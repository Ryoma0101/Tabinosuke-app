import React from "react";
import Image from "next/image";

interface ScheduleProps {
  time: string;
  endTime?: string;
  priority: "低" | "中" | "高";
  route: string;
  showCurrent?: boolean;
  showPriority?: boolean;
}

export default function Schedule({
  time,
  endTime,
  priority,
  route,
  showCurrent = true,
  showPriority = true,
}: ScheduleProps) {
  // 優先度に応じたテキストカラーを設定
  const priorityColor = {
    低: "text-green-500",
    中: "text-orange-500",
    高: "text-red-500",
  }[priority];

  return (
    <div className="flex justify-between items-center w-[330px] font-sans gap-6 p-0 m-0">
      <div className="flex flex-col items-center text-[13px] text-[#666666] font-normal leading-normal w-24 pl-2 whitespace-nowrap">
        <div>{time}</div>
        {endTime && (
          <>
            <span className="inline-block transform rotate-90">~</span>
            <div>{endTime}</div>
          </>
        )}
      </div>

      <div className="flex flex-col items-start w-56 gap-3 ml-4">
        <div className="flex items-start mb-4 text-base">
          <Image
            src="/icons/pin.svg"
            alt="Pin Icon"
            width={16}
            height={16}
            className="mr-1 flex-shrink-0"
          />
          <span className="whitespace-normal">{route}</span>
        </div>

        {(showCurrent || showPriority) && (
          <div className="flex gap-3 m-0">
            {showCurrent && (
              <div className="flex justify-center items-center gap-2.5 bg-primary text-[var(--bg,#FAFAFA)] px-[4px] py-[2px] rounded text-[13px] font-normal">
                現在地
              </div>
            )}
            {showPriority && (
              <div className="text-[13px] text-black">
                優先度: <span className={priorityColor}>{priority}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
