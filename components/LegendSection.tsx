import React from "react";

interface LegendSectionProps {
  isLegendVisible: boolean;
}

const LegendSection: React.FC<LegendSectionProps> = ({ isLegendVisible }) => {
  return (
    <div
      className={`bottom-0 right-0 flex flex-col items-start p-5 bg-[#C8E6C9] border-2 border-[#66BB6A] rounded-[30px] shadow-md text-[#388E3C] opacity-80 whitespace-nowrap overflow-hidden transition-all duration-500 w-auto ${
        isLegendVisible ? "max-h-[300px]" : "max-h-[10px]"
      }`}
    >
      {/* Nadpis */}
      <h3
        className={`self-center transition-opacity duration-300 ${
          isLegendVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        Legenda
      </h3>

      {/* Zelená čára pod nadpisem */}
      <div
        className={`w-[calc(100%+2.5rem)] -mx-5 border-b-2 border-[#66BB6A] mb-5 mt-2 transition-opacity duration-300 ${
          isLegendVisible ? "opacity-100" : "opacity-0"
        }`}
      ></div>

      {/* Obsah legendy */}
      <div
        className={`transition-opacity duration-300 ${
          isLegendVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <p>Popis 1</p>
        <p>Popis 2</p>
      </div>
    </div>
  );
};

export default LegendSection;
