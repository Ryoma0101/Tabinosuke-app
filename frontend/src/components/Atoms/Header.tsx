import React from "react";

type HeaderProps = {
  text?: string;
};

export default function Header({ text = "Header" }: HeaderProps) {
  return (
    <div className="flex w-[325px] h-[160px] items-center gap-[10px] shrink-0">
      <span
        className="text-[var(--text-description,#A1A1AA)] font-[400] text-[20px] leading-normal"
        style={{ fontFamily: "Noto Sans JP" }}
      >
        {text}
      </span>
    </div>
  );
}
