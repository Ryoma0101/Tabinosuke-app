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

export function DatePickerDemo({
  selectedDate,
  onDateChange,
}: {
  selectedDate?: Date;
  onDateChange: (date: Date | undefined) => void;
}) {
  const [date, setDate] = useState<Date | undefined>(selectedDate);

  const handleDateChange = (date: Date | undefined) => {
    setDate(date);
    onDateChange(date);
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
          onSelect={handleDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
