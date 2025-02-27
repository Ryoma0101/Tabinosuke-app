import React from "react";
import Image from "next/image";

interface ScheduleProps {
  time: string;
  route: string;
}

export default function Schedule({ time, route }: ScheduleProps) {
  return (
    <div className="flex justify-between items-center w-[330px] font-sans gap-[39px] p-0 m-0">
      <div className="flex flex-col items-center text-[13px] text-[#666666] font-normal leading-normal w-24 pl-2 whitespace-nowrap">
        <div>{time}</div>
      </div>

      <div className="flex flex-col flex-1 gap-3">
        <div className="flex items-start text-base">
          <Image
            src="/icons/pin.svg"
            alt="Pin Icon"
            width={16}
            height={16}
            className="mr-1 flex-shrink-0"
          />
          <span className="whitespace-normal">{route}</span>
        </div>
      </div>
    </div>
  );
}
