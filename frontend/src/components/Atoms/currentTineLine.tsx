import React from "react";
import Image from "next/image";

interface CurrentTimeLineProps {
  lineColor: "red" | "green";
}

export default function CurrentTimeLine({ lineColor }: CurrentTimeLineProps) {
  const lineColorClass = {
    red: "bg-red-500",
    green: "bg-green-500",
  }[lineColor];

  const textColorClass = {
    red: "text-red-500",
    green: "text-green-500",
  }[lineColor];

  return (
    <div className="flex items-center w-full gap-4 px-6">
      <div className="flex items-center gap-1">
        {lineColor === "red" && (
          <Image
            src="/icons/park-outline_caution.svg"
            alt="Caution Icon"
            width={13}
            height={13}
            className="flex-shrink-0"
          />
        )}
        <span className={`text-[13px] whitespace-nowrap ${textColorClass}`}>
          現在時刻
        </span>
      </div>
      <div className={`h-[2px] max-w-56 flex-grow ${lineColorClass}`}></div>
    </div>
  );
}
