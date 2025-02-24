import React from "react";
import ButtonToggle from "./ButtonToggle";

interface FilterSectionProps {
  showRadarData: boolean;
  setShowRadarData: (value: boolean) => void;
  showAccidentData: boolean;
  setShowAccidentData: (value: boolean) => void;
  showOtherData: boolean;
  setShowOtherData: (value: boolean) => void;
  isFiltersVisible: boolean;
  onUpdateData?: () => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  showRadarData,
  setShowRadarData,
  showAccidentData,
  setShowAccidentData,
  showOtherData,
  setShowOtherData,
  isFiltersVisible,
  onUpdateData,
}) => {
  return (
    <div
      className={`mb-5 flex flex-col items-start p-5 bg-[#C8E6C9] border-2 border-[#66BB6A] rounded-[30px] shadow-md text-[#388E3C] opacity-80 whitespace-nowrap overflow-hidden transition-all duration-500 ${
        isFiltersVisible ? "max-w-[300px]" : "max-w-[10px]"
      }`}
    >
      {/* Nadpis */}
      <h3
        className={`self-center transition-opacity duration-300 text-1xl font-bold ${
          isFiltersVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        Filtry
      </h3>

      {/* Zelená čára pod nadpisem */}
      <div
        className={`w-[calc(100%+2.5rem)] -mx-5  border-b-2 border-[#66BB6A] mb-5 mt-2 transition-opacity duration-300 ${
          isFiltersVisible ? "opacity-100" : "opacity-0"
        }`}
      ></div>

      {/* Obsah */}
      <div
        className={`transition-opacity duration-300 ${
          isFiltersVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <ButtonToggle
          showData={showRadarData}
          toggleGeoJsonVisibility={() => setShowRadarData(!showRadarData)}
          label="Radary"
        />
        <ButtonToggle
          showData={showAccidentData}
          toggleGeoJsonVisibility={() => setShowAccidentData(!showAccidentData)}
          label="Nehody"
        />
        <ButtonToggle
          showData={showOtherData}
          toggleGeoJsonVisibility={() => setShowOtherData(!showOtherData)}
          label="Jiná Data"
        />
        {/* Tlačítko pro aktualizaci dat */}
        <button
          onClick={onUpdateData}
          className="mt-4 bg-[#66BB6A] text-white px-4 py-2 rounded-[30px] shadow hover:bg-[#558b55]"
        >
          Aktualizovat
        </button>
      </div>
    </div>
  );
};

export default FilterSection;
