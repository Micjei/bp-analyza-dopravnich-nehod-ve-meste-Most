import React from "react";

interface FooterProps {
  footerText: string;
  lastUpdate?: string;
}

const FooterSection: React.FC<FooterProps> = ({ footerText, lastUpdate }) => {
  return (
    <div className="fixed bottom-0 w-full flex flex-row items-center justify-center bg-[#388E3C] border-2 border-[#66BB6A] shadow-md text-[#ffffff] opacity-80 whitespace-nowrap">
      {lastUpdate && (
        <p className="text-sm italic flex space-x-2">
          <span>{footerText}</span>
          <span>{lastUpdate}</span>
        </p>
      )}
    </div>
  );
};

export default FooterSection;
