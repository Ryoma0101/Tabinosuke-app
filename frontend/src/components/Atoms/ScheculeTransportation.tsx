import React from "react";

interface ScheduleProps {
  time: Date;
  transport: string;
}

export default function ScheduleTransportation({
  time,
  transport,
}: ScheduleProps) {
  const formattedTime = time
    .toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace("午前", "AM")
    .replace("午後", "PM");

  return (
    <div className="flex justify-between items-center w-[330px] font-sans gap-[39px] p-0 m-0">
      <div className="flex flex-col items-center text-[13px] text-[#666666] font-normal leading-normal w-24 pl-2 whitespace-nowrap">
        <div>{formattedTime}</div>
      </div>

      <div className="flex flex-col flex-1 gap-3">
        <span className="whitespace-normal text-[13px]">{transport}で移動</span>
      </div>
    </div>
  );
}
