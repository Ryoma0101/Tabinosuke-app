"use client";
import React from "react";

type DayProps = {
  date?: Date;
  day?: number;
};

export default function Day({ day = 1, date = new Date() }: DayProps) {
  return (
    <div className="flex w-[196px] h-[52px]">
      <div className="w-[2px] h-auto bg-[#16A34A]"></div>
      <span className="font-sans text-[#3F3F46] px-[20px] py-[9px] leading-[2.0]">
        {day}日目 ({date.toLocaleDateString()})
      </span>
    </div>
  );
}
