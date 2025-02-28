"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import DepartureCard from "@/components/Molecules/DepartureCard";
import DestinationCard from "@/components/Molecules/DestinationCard";
import ViaCard from "@/components/Molecules/ViaCard";
import AddViaButton from "@/components/Atoms/AddViaButton";
import { Input } from "@/components/Atoms/Input";
import TransportSelector from "@/components/Molecules/TransportSelector";

const initialVias: any[] = [];

const Card: React.FC = () => {
  const [viaList, setViaList] = useState(initialVias);
  const [departureDatetime, setDepartureDatetime] = useState<string | null>(
    null
  );
  const [location, setLocation] = useState<string | null>(null);

  const onRemoveTaskButtonClick = (index: number) => {
    const updatedViaList = viaList.filter((_, i) => i !== index);
    setViaList(updatedViaList);
  };

  const onAddViaButtonClick = () => {
    setViaList([
      ...viaList,
      {
        arrivalDatetime: null,
        departureDatetime: null,
        location: null,
        priority: "",
      },
    ]);
  };

  const handleSelectPlace = (index: number, place: string) => {
    const updatedViaList = [...viaList];
    updatedViaList[index].location = place;
    setViaList(updatedViaList);
  };

  const handleSelectArrivalDatetime = (index: number, datetime: string) => {
    const updatedViaList = [...viaList];
    updatedViaList[index].arrivalDatetime = datetime;
    setViaList(updatedViaList);
  };

  const handleSelectDepartureDatetime = (index: number, datetime: string) => {
    const updatedViaList = [...viaList];
    updatedViaList[index].departureDatetime = datetime;
    setViaList(updatedViaList);
  };

  const handleSelectPriority = (
    index: number,
    priority: "低" | "中" | "高"
  ) => {
    const updatedViaList = [...viaList];
    updatedViaList[index].priority = priority;
    setViaList(updatedViaList);
  };

  return (
    <ul className="flex flex-col relative w-[326px] gap-[52px]">
      <div className="flex flex-col">
        <h2 className="mb-[16px]">プランを入力</h2>
        <Input />
      </div>
      <div>
        <DepartureCard
          departure_datetime={departureDatetime}
          location={location}
          onSelectPlace={setLocation}
          onSelectDatetime={setDepartureDatetime}
        />
      </div>
      <TransportSelector />
      <div className="flex flex-col gap-[52px]">
        {viaList.map((via, index) => (
          <ViaCard
            key={index}
            onRemove={() => onRemoveTaskButtonClick(index)}
            arrivalDatetime={via.arrivalDatetime}
            departureDatetime={via.departureDatetime}
            location={via.location}
            onSelectPlace={(place) => handleSelectPlace(index, place)}
            onSelectArrivalDatetime={(datetime) =>
              handleSelectArrivalDatetime(index, datetime)
            }
            onSelectDepartureDatetime={(datetime) =>
              handleSelectDepartureDatetime(index, datetime)
            }
            priority={via.priority}
            onSelectPriority={(priority) =>
              handleSelectPriority(index, priority)
            }
          />
        ))}
        <AddViaButton onClick={onAddViaButtonClick} />
      </div>
      <div>
        <DestinationCard />
      </div>
      <div className="flex justify-center">
        <Button className="w-[136px] bg-[#3f3f46]">作成する</Button>
      </div>
    </ul>
  );
};

export default Card;
