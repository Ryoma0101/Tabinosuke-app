"use client";
import React from "react";
import { PlaceInput } from "@/components/ui/placeinput";
import { DatePickerDemo } from "@/components/ui/DatePicker";
import { Clock4 } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface ViaCardProps {
  onRemove: () => void;
}

const ViaCard: React.FC<ViaCardProps> = ({ onRemove }) => {
  const handleClick = (event: React.MouseEvent<HTMLInputElement>) => {
    event.currentTarget.showPicker();
  };

  return (
    <ul className="via-card">
      <div className="mb-[16px] flex justify-between items-center w-[318px]">
        <h2 className="text-[var(--text-border-default,#3F3F46)] font-noto text-[20px] font-normal leading-normal">
          経由地
        </h2>
        <span onClick={onRemove}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M14 11V17M10 11V17M6 7V19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19V7M4 7H20M7 7L9 3H15L17 7"
              stroke="#3F3F46"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
      <div className="mb-[16px] items-center">
        <p className="text-[#3F3F46] font-noto text-[16px] font-normal leading-normal mb-[12px]">
          場所
        </p>
        <PlaceInput />
      </div>
      <div className="mb-[16px]">
        <p className="text-[var(--text-border-default,#3F3F46)] font-noto text-[16px] font-normal leading-normal mb-[12px]">
          到着時間目安
        </p>
        <div className="flex space-x-4 mb-[16px]">
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
      </div>
      <div className="mb-[16px]">
        <p className="text-[var(--text-border-default,#3F3F46)] font-noto text-[16px] font-normal leading-normal mb-[12px]">
          優先度
        </p>
        <Select>
          <SelectTrigger className="w-[86px]">
            <SelectValue placeholder="ー" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="高">高</SelectItem>
            <SelectItem value="中">中</SelectItem>
            <SelectItem value="低">低</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <p className="text-[var(--text-border-default,#3F3F46)] font-noto text-[16px] font-normal leading-normal mb-[12px]">
          出発時間目安
        </p>
        <div className="flex space-x-[16px] mb-[52px]">
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
      </div>
    </ul>
  );
};

export default ViaCard;
