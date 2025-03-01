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

  const handleSubmit = async () => {
    const payload = {
      plan_name: plan.input,
      start_point: {
        location: plan.departure.place,
        departure_datetime: plan.departure.date,
        travel_method_to_next: transport,
      },
      via_points: plan.vias.map((via, index) => ({
        index: index + 1,
        location: via.place,
        arrival_datetime: via.arrivalDate,
        priority: via.priority,
        departure_datetime: via.departureDate,
        travel_method_to_next: transport,
      })),
      final_point: {
        location: plan.destination.place,
      },
    };

    try {
      const response = await fetch(
        "https://two025-tabinosuke-dev.onrender.com/api/save/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save plan");
      }

      alert("プランが保存されました");
    } catch (error) {
      console.error("Error saving plan:", error);
      alert("プランの保存に失敗しました");
    }
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
      <div className="flex justify-center">
        <Button className="w-[136px] bg-[#3f3f46]" onClick={handleSubmit}>
          作成する
        </Button>
      </div>
    </ul>
  );
};

export default Card;
