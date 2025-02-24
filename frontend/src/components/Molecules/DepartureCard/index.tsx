"use client";

import React from "react";
import { PlaceInput } from "@/components/ui/placeinput";
import { DatePickerDemo } from "@/components/ui/DatePicker";
import { Clock4 } from "lucide-react";

interface DepartureCardProps {
  title: string;
  time: string;
  location: string;
}

const DepartureCard: React.FC<DepartureCardProps> = ({
  title,
  time,
  location,
}) => {
  const handleClick = (event: React.MouseEvent<HTMLInputElement>) => {
    event.currentTarget.showPicker();
  };
  return (
    <ul className="departure-card">
      <div>
        <h2 className="text-[var(--text-border-default,#3F3F46)] font-noto text-[20px] font-normal leading-normal">
          {title}
        </h2>
      </div>
      <div>
        <p className="text-[var(--text-border-default,#3F3F46)] font-noto text-[16px] font-normal leading-normal">
          {location}
        </p>
        <PlaceInput />
      </div>
      <div>
        <p className="text-[var(--text-border-default,#3F3F46)] font-noto text-[16px] font-normal leading-normal">
          {time}
        </p>
        <DatePickerDemo />
        <div className="relative flex items-center w-[102px] h-[43px]">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Clock4 className="h-5 w-5 text-gray-400" />
          </span>
          <input
            type="time"
            onClick={handleClick}
            className="pl-10 h-10 w-full rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <style jsx>{`
            input[type="time"]::-webkit-calendar-picker-indicator {
              display: none;
            }
            input[type="time"]:focus {
              outline: none;
            }
          `}</style>
        </div>
      </div>
    </ul>
  );
};

export default DepartureCard;
