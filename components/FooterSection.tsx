import React from "react";

interface FooterProps {
  footerText: string;
}

const Footer: React.FC<FooterProps> = ({ footerText }) => {
  return (
    <div
      className={
        "absolute bottom-0 w-full transform flex flex-col items-center bg-[#C8E6C9] border-2 border-t-[#66BB6A] shadow-md text-[#388E3C] opacity-80 whitespace-nowrap overflow-hidden transition-all duration-500"
      }
    >
      <h3 className={"transition-opacity duration-300"}>{footerText}</h3>
    </div>
  );
};

export default Footer;
