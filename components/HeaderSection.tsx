import React from "react";

interface FooterProps {
  headerText: string;
}

const HeaderSection: React.FC<FooterProps> = ({ headerText }) => {
  return (
    <div
      className={
        "absolute top-0 w-full flex flex-col items-center p-5 bg-[#66BB6A] border-2 border-[#66BB6A] shadow-md text-[#ffffff] opacity-80 whitespace-nowrap"
      }
    >
      <h3 className={"transition-opacity duration-300"}>{headerText}</h3>
    </div>
  );
};

export default HeaderSection;
