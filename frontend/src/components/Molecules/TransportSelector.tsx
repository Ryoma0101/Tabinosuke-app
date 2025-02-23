"use client";
import { useState } from "react";
import Image from "next/image";

const transportModes = [
  { id: "car", src: "/icons/car.svg", label: "車" },
  { id: "train", src: "/icons/train.svg", label: "電車" },
  { id: "bus", src: "/icons/bus.svg", label: "バス" },
  { id: "walk", src: "/icons/walk.svg", label: "徒歩" },
  { id: "plane", src: "/icons/plane.svg", label: "飛行機" },
  { id: "ship", src: "/icons/ship.svg", label: "船" },
];

export default function TransportSelector() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex items-stretch font-sans h-auto">
      <div className="w-1 bg-gray-700"></div>
      <div className="ml-6 flex flex-col p-4">
        <h2 className="text-base mb-4">移動手段の選択</h2>
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
                width={32}
                height={32}
                className={selected === mode.id ? "brightness-0 invert" : ""}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
