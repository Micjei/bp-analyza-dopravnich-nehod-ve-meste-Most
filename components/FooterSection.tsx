import React from "react";

interface FooterProps {
  footerText: string;
}

const FooterSection: React.FC<FooterProps> = ({ footerText }) => {
  return (
    <div
      className={
        "absolute bottom-0 w-full flex flex-col items-center bg-[#388E3C] border-2 border-[#66BB6A] shadow-md text-[#ffffff] opacity-80 whitespace-nowrap"
      }
    >
      <h3 className={"transition-opacity duration-300"}>{footerText}</h3>
    </div>
  );
};

export default FooterSection;
