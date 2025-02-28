"use client";
import React from "react";
import { PlaceInput } from "@/components/ui/placeinput";
import { DatePickerDemo } from "@/components/ui/DatePicker";
import { Clock4 } from "lucide-react";

interface DepartureCardProps {
  departure_datetime: string | null;
  location: string | null;
  onSelectPlace: (place: string) => void;
  onSelectDatetime: (datetime: string) => void;
}

const DepartureCard: React.FC<DepartureCardProps> = ({
  departure_datetime,
  location,
  onSelectPlace,
  onSelectDatetime,
}) => {
  const handleClick = (event: React.MouseEvent<HTMLInputElement>) => {
    event.currentTarget.showPicker();
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelectDatetime(e.target.value);
  };

  return (
    <ul className="departure-card">
      <div className="mb-[16px]">
        <h2 className="text-[var(--text-border-default,#3F3F46)] font-noto text-[20px] font-normal leading-normal">
          出発地点
        </h2>
      </div>

      <div className="mb-[16px]">
        <p className="text-[var(--text-border-default,#3F3F46)] font-noto text-[16px] font-normal leading-normal mb-[12px]">
          場所
        </p>
        <PlaceInput value={location || ""} onSelectPlace={onSelectPlace} />
      </div>
      <div>
        <p className="text-[var(--text-border-default,#3F3F46)] font-noto text-[16px] font-normal leading-normal mb-[12px]">
          出発予定時刻
        </p>
        <div className="flex space-x-[16px]">
          <DatePickerDemo
            value={departure_datetime || ""}
            onSelectDatetime={onSelectDatetime}
          />
          <div className="relative flex items-center w-[102px] h-[43px]">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Clock4 className="h-5 w-5 text-gray-400" />
            </span>
            <input
              type="time"
              value={departure_datetime || ""}
              onChange={handleTimeChange}
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
      </div>
    </ul>
  );
};

export default DepartureCard;
