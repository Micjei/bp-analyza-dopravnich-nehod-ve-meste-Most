import React, { useEffect, useState } from "react";
import ButtonToggle from "./ButtonToggle";
import { Slider } from "primereact/slider";
import { InputText } from "primereact/inputtext";
import "primereact/resources/themes/lara-light-indigo/theme.css"; // Téma pro slider
import "primereact/resources/primereact.min.css"; // Základní styly pro všechny komponenty PrimeReact

const getCurrentYear = () => new Date().getFullYear();
const years = Array.from(
  { length: getCurrentYear() - 2014 },
  (_, i) => 2015 + i
);

// přestupný rok
const isLeapYear = (year: number) => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

// Funkce pro získání počtu dní v měsíci
const getDaysInMonth = (month: number, year: number) => {
  const daysInMonth = [
    31, // Leden
    28 + (isLeapYear(year) ? 1 : 0), // Únor (28 nebo 29 dní)
    31, // Březen
    30, // Duben
    31, // Květen
    30, // Červen
    31, // Červenec
    31, // Srpen
    30, // Září
    31, // Říjen
    30, // Listopad
    31, // Prosinec
  ];

  return daysInMonth[month - 1];
};

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
  selectedMonth: string;
  setSelectedMonth: (value: string) => void;
  selectedDay: string;
  setSelectedDay: (value: string) => void;
  onUpdateData?: () => void;
  realAngle: boolean;
  setRealAngle: (value: boolean) => void;
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
  selectedMonth,
  setSelectedMonth,
  selectedDay,
  setSelectedDay,
  onUpdateData,
  realAngle,
  setRealAngle,
}) => {
  const [days, setDays] = useState<string[]>([]);

  // Funkce pro aktualizaci počtu dnů při změně měsíce nebo roku
  useEffect(() => {
    const month = parseInt(selectedMonth);
    const year = parseInt(selectedYear);
    const numberOfDays = getDaysInMonth(month, year);

    // Generování seznamu dnů na základě měsíce a roku
    const daysList = [
      "all",
      ...Array.from({ length: numberOfDays }, (_, i) => (i + 1).toString()),
    ];
    setDays(daysList);

    if (parseInt(selectedDay) > numberOfDays) {
      setSelectedDay("all");
    }
  }, [selectedMonth, selectedYear, selectedDay, setSelectedDay]);

  const months = [
    "all",
    ...Array.from({ length: 12 }, (_, i) => (i + 1).toString()),
  ];

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
        <div className="flex flex-row items-center gap-2">
          <ButtonToggle
            showData={showRadarData}
            toggleGeoJsonVisibility={() => setShowRadarData(!showRadarData)}
            label="Radary"
          />
          <button onClick={() => setRealAngle(!realAngle)}>
            {realAngle ? "směr: ano" : "směr: ne"}
          </button>
        </div>
        <ButtonToggle
          showData={showAccidentData}
          toggleGeoJsonVisibility={() => setShowAccidentData(!showAccidentData)}
          label="Nehody"
        />
        {/* Výběr roku */}
        <div className="ml-6">
          {/*<div className="flex flex-row gap-2">
            <p>rok:</p>
            <InputText
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent"
              style={{ width: ${selectedYear.length * 10}px }}
            />
          </div>
          <Slider
            value={parseInt(selectedYear)}
            onChange={(e) => setSelectedYear(e.value.toString())}
            min={2015}
            max={getCurrentYear()}
            step={1}
            className="w-full h-2 bg-gray-200 rounded-lg my-2"
          />*/}
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

          {/* Výběr měsíce */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border rounded"
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month === "all" ? "-" : `${month}`}
              </option>
            ))}
          </select>

          {/* Výběr dne */}
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="border rounded"
          >
            {days.map((day) => (
              <option key={day} value={day}>
                {day === "all" ? "-" : `${day}`}
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
