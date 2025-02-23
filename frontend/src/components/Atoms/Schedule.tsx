import React from "react";

interface ScheduleProps {
  time: string;
  priority: "低" | "中" | "高";
  route: string;
  showCurrent?: boolean;
  showPriority?: boolean;
}

export default function Schedule({
  time,
  priority,
  route,
  showCurrent = true,
  showPriority = true,
}: ScheduleProps) {
  return (
    <div className="flex justify-between items-start w-[330px] font-sans gap-6 p-0 m-0">
      {/* 左上の時間（JSONから取得） */}
      <div className="text-[13px] text-[#666666] font-sans font-normal leading-normal w-16">
        {time}
      </div>

      {/* 右側パネル */}
      <div className="flex flex-col items-start w-56 gap-3">
        {/* アイコン＋経由地（JSONから取得） */}
        <div className="flex justify-start mb-4 text-base">
          <img src="/icons/pin.svg" className="mr-1" alt="Pin Icon" />
          <span>{route}</span>
        </div>

        {/* 現在地と優先度の表示エリア */}
        {(showCurrent || showPriority) && (
          <div className="flex gap-3 m-0">
            {showCurrent && (
              <div className="flex justify-center items-center gap-2.5 bg-primary text-[var(--bg,#FAFAFA)] px-[4px] py-[2px] rounded text-[13px] font-sans font-normal">
                現在地
              </div>
            )}

            {showPriority && (
              <div className="text-base text-[13px]">優先度: {priority}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
