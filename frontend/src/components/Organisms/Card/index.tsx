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
  const [departureDatetime, setDepartureDatetime] = useState<string | null>(
    null
  );
  const [location, setLocation] = useState<string | null>(null);

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
        {ViaList.map((_, index) => (
          <ViaCard
            key={index}
            onRemove={() => onRemoveTaskButtonClick(index)}
          />
        ))}
        <AddViaButton onClick={onAddViaButtonClick} />
      </div>
      <div>
        <DestinationCard />
      </div>
      <div className="flex flex-col justify-center items-center">
        <Button className="w-[136px] bg-[#3f3f46]">作成する</Button>
        <p>※まだ作成できません。</p>
        <div className="h-10" />
        <Button className="w-[136px] bg-[#3f3f46]" onClick={() => window.location.href = '/'}>
          最初のページに戻る
        </Button>
      </div>
    </ul>
  );
};

export default Card;
