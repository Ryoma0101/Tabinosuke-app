"use client";
import { useState } from "react";
import Image from "next/image";

const transportModes = [
  { id: "car", src: "/icons/car.svg", label: "car" },
  { id: "train", src: "/icons/train.svg", label: "public" },
  { id: "walk", src: "/icons/walk.svg", label: "walk" },
];

export default function TransportSelector() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex items-stretch font-sans h-auto gap-6">
      <div className="w-0.5 bg-gray-700"></div>
      <div className="flex flex-col gap-4">
        <h2 className="text-base">移動手段の選択</h2>
        <div className="flex space-x-2">
          {transportModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setSelected(mode.id)}
              className={`relative p-3 rounded-full transition ${
                selected === mode.id ? "bg-[#16A34A]" : "hover:bg-green-100"
              }`}
            >
              <Image
                src={mode.src}
                alt={mode.label}
                width={24}
                height={24}
                className={selected === mode.id ? "brightness-0 invert" : ""}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
