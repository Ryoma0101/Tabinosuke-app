import React from "react";
import Header from "@/components/Atoms/Header";
import Day from "@/components/Atoms/Day";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-[768px] my-0 mx-[30px] bg-white">
        <Header text="計画" />
        <Day day={1} date={new Date(2025, 1, 22)} />
        <main></main>
      </div>
    </div>
  );
}
