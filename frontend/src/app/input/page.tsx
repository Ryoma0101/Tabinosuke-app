import React from "react";
import Header from "@/components/Atoms/Header";
import Card from "@/components/Organisms/Card";

const InputPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-[768px] mx-auto bg-white px-9 py-4">
        <div className="flex flex-col items-center gap-11">
          <Header text="計画" />
          <Card />
        </div>
      </div>
    </div>
  );
};

export default InputPage;
