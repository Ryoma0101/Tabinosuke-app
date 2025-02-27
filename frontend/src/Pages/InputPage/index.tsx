import React from "react";
import Header from "@/components/Atoms/Header";
import Card from "@/components/Organisms/Card";
const InputPage: React.FC = () => {
  return (
    <div className="flex flex-col justify-center">
      <Header text="計画" />
      <Card />
    </div>
  );
};
export default InputPage;
