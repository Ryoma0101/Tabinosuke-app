import React from "react";

interface AddViaButtonProps {
  onClick: () => void;
}

const AddViaButton: React.FC<AddViaButtonProps> = ({ onClick }) => {
  return (
    <div
      className="w-[112px] text-[var(--main,#16A34A)] font-noto text-[16px] font-normal leading-normal cursor-pointer hover:text-green-700"
      onClick={onClick}
    >
      <p>+経由地を追加</p>
    </div>
  );
};

export default AddViaButton;
