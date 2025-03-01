import React from "react";
import ButtonToggle from "./ButtonToggle";

const getCurrentYear = () => new Date().getFullYear();
const years = Array.from(
  { length: getCurrentYear() - 2014 },
  (_, i) => 2015 + i
);

interface FilterSectionProps {
  showRadarData: boolean;
  setShowRadarData: (value: boolean) => void;
  showAccidentData: boolean;
  setShowAccidentData: (value: boolean) => void;
  showTrafficData: boolean;
  setShowTrafficData: (value: boolean) => void;
  isFiltersVisible: boolean;
  selectedYear: string;
  setSelectedYear: (value: string) => void;
  onUpdateData?: () => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  showRadarData,
  setShowRadarData,
  showAccidentData,
  setShowAccidentData,
  showTrafficData,
  setShowTrafficData,
  isFiltersVisible,
  selectedYear,
  setSelectedYear,
  onUpdateData,
}) => {
  return (
    <div
      className={`flex flex-col items-start p-5 bg-[#C8E6C9] border-2 border-[#66BB6A] rounded-[30px] shadow-md text-[#388E3C] opacity-80 whitespace-nowrap overflow-hidden transition-all duration-500 ${
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
        <div className="flex flex-row items-center gap-2">
          <ButtonToggle
            showData={showAccidentData}
            toggleGeoJsonVisibility={() =>
              setShowAccidentData(!showAccidentData)
            }
            label="Nehody"
          />
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border rounded"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <ButtonToggle
          showData={showTrafficData}
          toggleGeoJsonVisibility={() => setShowTrafficData(!showTrafficData)}
          label="Dopravní situace"
        />
        {/* Tlačítko pro aktualizaci dat */}
        <button
          onClick={onUpdateData}
          className="mt-4 bg-[#66BB6A] text-white px-4 py-2 rounded-[30px] shadow hover:bg-[#558b55] w-full"
        >
          Aktualizovat
        </button>
      </div>
    </div>
  );
};

export default FilterSection;
