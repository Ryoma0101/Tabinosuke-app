import React, { useState } from "react";
import Header from "@/components/Atoms/Header";
import { Button } from "@/components/ui/button";
import TransportSelector from "@/components/Molecules/TransportSelector";
import Day from "@/components/Atoms/Day";
import Schedule from "@/components/Atoms/Schedule";
import DepartureCard from "@/components/Molecules/DepartureCard";
import DestinationCard from "@/components/Molecules/DestinationCard";
import ViaCard from "@/components/Molecules/ViaCard";
import AddViaButton from "@/components/Atoms/AddViaButton";
import { Input } from "@/components/Atoms/Input/input";

const initialVias: number[] = [];
const Card: React.FC = () => {
  const [ViaList, setViaList] = useState(initialVias);

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
        <DepartureCard />
      </div>
      <div>
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
      <div className="flex justify-center">
        <Button className="w-[136px] bg-[#3f3f46]">作成する</Button>
      </div>
    </ul>
  );
};

export default Card;
