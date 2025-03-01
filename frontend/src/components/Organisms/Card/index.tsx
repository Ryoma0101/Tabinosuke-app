"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import DepartureCard from "@/components/Molecules/DepartureCard";
import DestinationCard from "@/components/Molecules/DestinationCard";
import ViaCard from "@/components/Molecules/ViaCard";
import AddViaButton from "@/components/Atoms/AddViaButton";
import { Input } from "@/components/Atoms/Input";
import TransportSelector from "@/components/Molecules/TransportSelector";

const initialVias: number[] = [];

const Card: React.FC = () => {
  const [ViaList, setViaList] = useState(initialVias);
  const [plan, setPlan] = useState({
    plan_name: "",
    start_point: { location: "", date: undefined, travel_method_to_next: "", departure_datetime: undefined },
    via_points: [
      {
        index: 0,
        location: "",
        arrival_datetime: undefined,
        priority: "",
        departure_datetime: undefined,
        travel_method_to_next: "",
      },
    ],
    final_point: { location: "", date: undefined, arrival_datetime: "" },
  });
  const [transport, setTransport] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlan({ ...plan, plan_name: e.target.value });
  };

  const handleDepartureChange = (field: string, value: any) => {
    setPlan({ ...plan, start_point: { ...plan.start_point, [field]: value } });
  };

  const handleViaChange = (index: number, field: string, value: any) => {
    const updatedVias = [...plan.via_points];
    updatedVias[index] = { ...updatedVias[index], [field]: value };
    setPlan({ ...plan, via_points: updatedVias });
  };

  const handleDestinationChange = (field: string, value: any) => {
    setPlan({ ...plan, final_point: { ...plan.final_point, [field]: value } });
  };

  const handleTransportChange = (transport: string) => {
    setTransport(transport);
  };

  const handleDateTimeChange = (
    type: "departure" | "via" | "destination",
    index: number | null,
    field:
      | "date"
      | "time"
      | "arrivalDate"
      | "arrivalTime"
      | "departureDate"
      | "departureTime"
      | "departure_datetime"
      | "arrival_datetime",
    value: any
  ) => {
    if (type === "departure") {
      setPlan({
        ...plan,
        start_point: { ...plan.start_point, [field]: value },
      });
    } else if (type === "via" && index !== null) {
      const updatedVias = [...plan.via_points];
      updatedVias[index] = { ...updatedVias[index], [field]: value };
      setPlan({ ...plan, via_points: updatedVias });
    } else if (type === "destination") {
      setPlan({
        ...plan,
        final_point: { ...plan.final_point, [field]: value },
      });
    }
  };

  const onRemoveTaskButtonClick = (index: number) => {
    const updatedViaList = ViaList.filter((_, i) => i !== index);
    setViaList(updatedViaList);
  };

  const onAddViaButtonClick = () => {
    setViaList([...ViaList, ViaList.length + 1]);
  };

  return (
    <ul className="flex flex-col relative w-[326px] gap-[52px]">
      <div className="flex flex-col">
        <h2 className="mb-[16px]">プランを入力</h2>
        <Input value={plan.plan_name} onChange={handleInputChange} />
      </div>
      <div>
        <DepartureCard
          place={plan.start_point.location}
          date={plan.start_point.date}
          time={plan.start_point.departure_datetime || ""}
          onPlaceChange={(value) => handleDepartureChange("location", value)}
          onDateChange={(value) =>
            handleDateTimeChange("departure", null, "date", value)
          }
          onTimeChange={(value) =>
            handleDateTimeChange("departure", null, "departure_datetime", value)
          }
        />
      </div>
      <TransportSelector
        selectedTransport={transport}
        onTransportChange={handleTransportChange}
      />
      <div className="flex flex-col gap-[52px]">
        {ViaList.map((_, index) => (
          <ViaCard
            key={index}
            place={plan.via_points[index]?.location}
            arrivalDate={plan.via_points[index]?.arrival_datetime}
            arrivalTime={plan.via_points[index]?.arrival_datetime || ""}
            priority={plan.via_points[index]?.priority}
            departureDate={plan.via_points[index]?.departure_datetime}
            departureTime={plan.via_points[index]?.departure_datetime || ""}
            transport={transport}
            onTransportChange={handleTransportChange}
            onPlaceChange={(value) => handleViaChange(index, "location", value)}
            onArrivalDateChange={(value) =>
              handleDateTimeChange("via", index, "arrival_datetime", value)
            }
            onArrivalTimeChange={(value) =>
              handleDateTimeChange("via", index, "arrival_datetime", value)
            }
            onPriorityChange={(value) =>
              handleViaChange(index, "priority", value)
            }
            onDepartureDateChange={(value) =>
              handleDateTimeChange("via", index, "departure_datetime", value)
            }
            onDepartureTimeChange={(value) =>
              handleDateTimeChange("via", index, "departure_datetime", value)
            }
            onRemove={() => onRemoveTaskButtonClick(index)}
          />
        ))}
        <AddViaButton onClick={onAddViaButtonClick} />
      </div>
      <div>
        <DestinationCard
          place={plan.final_point.location}
          date={plan.final_point.date}
          time={plan.final_point.arrival_datetime}
          onPlaceChange={(value) => handleDestinationChange("location", value)}
          onDateChange={(value) =>
            handleDateTimeChange("destination", null, "date", value)
          }
          onTimeChange={(value) =>
            handleDateTimeChange("destination", null, "arrival_datetime", value)
          }
        />
      </div>
      <Button className="w-[136px] bg-[#3f3f46]">作成する</Button>
    </ul>
  );
};

export default Card;
