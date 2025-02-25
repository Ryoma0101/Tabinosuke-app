import React from "react";

interface AddViaButtonProps {
  onClick: () => void;
}

const AddViaButton: React.FC<AddViaButtonProps> = ({ onClick }) => {
  return (
    <div className="text-[var(--main,#16A34A)] font-noto text-[16px] font-normal leading-normal" onClick={onClick}>
      <p>+経由地を追加</p>
    </div>
  );
};

export default AddViaButton;