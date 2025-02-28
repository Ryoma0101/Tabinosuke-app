"use client";
import React, { useState } from "react";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerDemoProps {
  value: string;
  onSelectDatetime: (datetime: string) => void;
}

export function DatePickerDemo({
  value,
  onSelectDatetime,
}: DatePickerDemoProps) {
  const [date, setDate] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  );

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      onSelectDatetime(selectedDate.toISOString().split("T")[0]);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "relative w-[144px] justify-center text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarDays className="absolute left-[7px] h-4 w-4" />
          {date ? format(date, "yyyy/MM/dd") : <span></span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
