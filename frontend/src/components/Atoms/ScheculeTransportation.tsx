import React from "react";

interface ScheduleProps {
  transport: string;
}

export default function ScheduleTransportation({
  transport,
}: ScheduleProps) {
  return (
    <div className="flex justify-center items-center w-full h-full font-sans p-0 m-0">
      <div className="flex flex-col items-center gap-3">
        <span className="whitespace-normal text-[13px]">{transport}で移動</span>
      </div>
    </div>
  );
}
