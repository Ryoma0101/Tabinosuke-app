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
    input: "",
    departure: { place: "", date: undefined, time: "" },
    vias: [
      {
        place: "",
        arrivalDate: undefined,
        arrivalTime: "",
        priority: "",
        departureDate: undefined,
        departureTime: "",
      },
    ],
    destination: { place: "", date: undefined, time: "" },
  });
  const [transport, setTransport] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlan({ ...plan, input: e.target.value });
  };

  const handleDepartureChange = (field: string, value: any) => {
    setPlan({ ...plan, departure: { ...plan.departure, [field]: value } });
  };

  const handleViaChange = (index: number, field: string, value: any) => {
    const updatedVias = [...plan.vias];
    updatedVias[index] = { ...updatedVias[index], [field]: value };
    setPlan({ ...plan, vias: updatedVias });
  };

  const handleDestinationChange = (field: string, value: any) => {
    setPlan({ ...plan, destination: { ...plan.destination, [field]: value } });
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
      | "departureTime",
    value: any
  ) => {
    if (type === "departure") {
      setPlan({ ...plan, departure: { ...plan.departure, [field]: value } });
    } else if (type === "via" && index !== null) {
      const updatedVias = [...plan.vias];
      updatedVias[index] = { ...updatedVias[index], [field]: value };
      setPlan({ ...plan, vias: updatedVias });
    } else if (type === "destination") {
      setPlan({
        ...plan,
        destination: { ...plan.destination, [field]: value },
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
        <Input value={plan.input} onChange={handleInputChange} />
      </div>
      <div>
        <DepartureCard
          place={plan.departure.place}
          date={plan.departure.date}
          time={plan.departure.time}
          onPlaceChange={(value) => handleDepartureChange("place", value)}
          onDateChange={(value) =>
            handleDateTimeChange("departure", null, "date", value)
          }
          onTimeChange={(value) =>
            handleDateTimeChange("departure", null, "time", value)
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
            place={plan.vias[index].place}
            arrivalDate={plan.vias[index].arrivalDate}
            arrivalTime={plan.vias[index].arrivalTime}
            priority={plan.vias[index].priority}
            departureDate={plan.vias[index].departureDate}
            departureTime={plan.vias[index].departureTime}
            transport={transport}
            onTransportChange={handleTransportChange}
            onPlaceChange={(value) => handleViaChange(index, "place", value)}
            onArrivalDateChange={(value) =>
              handleDateTimeChange("via", index, "arrivalDate", value)
            }
            onArrivalTimeChange={(value) =>
              handleDateTimeChange("via", index, "arrivalTime", value)
            }
            onPriorityChange={(value) =>
              handleViaChange(index, "priority", value)
            }
            onDepartureDateChange={(value) =>
              handleDateTimeChange("via", index, "departureDate", value)
            }
            onDepartureTimeChange={(value) =>
              handleDateTimeChange("via", index, "departureTime", value)
            }
            onRemove={() => onRemoveTaskButtonClick(index)}
          />
        ))}
        <AddViaButton onClick={onAddViaButtonClick} />
      </div>
      <div>
        <DestinationCard
          place={plan.destination.place}
          date={plan.destination.date}
          time={plan.destination.time}
          onPlaceChange={(value) => handleDestinationChange("place", value)}
          onDateChange={(value) =>
            handleDateTimeChange("destination", null, "date", value)
          }
          onTimeChange={(value) =>
            handleDateTimeChange("destination", null, "time", value)
          }
        />
      </div>
      <Button className="w-[136px] bg-[#3f3f46]">作成する</Button>
    </ul>
  );
};

export default Card;
