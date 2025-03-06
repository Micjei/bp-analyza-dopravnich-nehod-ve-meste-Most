import React from "react";

interface LegendSectionProps {
  isLegendVisible: boolean;
  showTrafficData: boolean;
}

const LegendSection: React.FC<LegendSectionProps> = ({
  isLegendVisible,
  showTrafficData,
}) => {
  return (
    <div
      className={`bottom-0 right-0 flex flex-col items-start p-5 bg-[#C8E6C9] border-2 border-[#66BB6A] rounded-[30px] shadow-md text-[#388E3C] opacity-80 whitespace-nowrap overflow-hidden transition-all duration-500 w-auto ${
        isLegendVisible ? "max-h-[300px]" : "max-h-[10px]"
      }`}
    >
      {/* Nadpis */}
      <h3
        className={`self-center transition-opacity duration-300 text-1xl font-bold ${
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
        <div className={`flex flex-col`}>
          {showTrafficData && (
            <div>
              <div className="flex items-center space-x-2">
                <div className="w-12 h-2 bg-red-500"></div> {/* Červená čára */}
                <span>Zácpa</span> {/* Popis */}
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <div className="w-12 h-2 bg-orange-500"></div>{" "}
                {/* Oranžová čára */}
                <span>Pomalý provoz</span> {/* Popis */}
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <div className="w-12 h-2 bg-yellow-500"></div>{" "}
                {/* Žlutá čára */}
                <span>Snížená rychlost</span> {/* Popis */}
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <div className="w-12 h-2 bg-green-500"></div>{" "}
                {/* Zelená čára */}
                <span>Plynulý provoz</span> {/* Popis */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LegendSection;
