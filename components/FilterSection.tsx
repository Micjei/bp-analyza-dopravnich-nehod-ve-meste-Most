import React, { useEffect, useState, useRef } from "react";
import ButtonToggle from "./ButtonToggle";
import "primereact/resources/themes/lara-light-indigo/theme.css"; // Téma pro slider
import "primereact/resources/primereact.min.css"; // Základní styly pro všechny komponenty PrimeReact
import { motion, AnimatePresence } from "framer-motion";
import {
  getCurrentYear,
  years,
  getDaysInMonth,
  isLeapYear,
  alcoholOptions,
  drugsOptions,
  pedestrianOptions,
  consequenceOptions,
  activeRadarOptions,
} from "@/utils/selectOptions";
import "primeicons/primeicons.css";
interface CustomSelectProps {
  options: string[]; // Explicitní typ pro pole možností (můžeš změnit typ dle potřeby)
  value: string | null;
  onChange: (value: string) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const handleClick = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setIsOpen(false); // Zavření selectu
      }
    };

    // Přidání event listeneru
    document.addEventListener("mousedown", handleClickOutside);

    // Vyčištění listeneru
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div ref={selectRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="border-2 border-[#ffffff] rounded px-2 text-left hover:bg-slate-50"
      >
        {value || "Vyberte možnost"}
      </button>

      {isOpen && (
        <div
          className="fixed flex items-center justify-center"
          onClick={() => setIsOpen(false)} // Zavření při kliknutí mimo
        >
          <div
            className="w-max bg-white border rounded shadow-lg p-2"
            onClick={(e) => e.stopPropagation()} // Zabrání zavření při kliknutí uvnitř
          >
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${Math.min(
                  options.length,
                  7
                )}, minmax(40px, 1fr))`,
              }}
            >
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleClick(option)}
                  className="border rounded p-2 text-center hover:bg-gray-200"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
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
  alcoholFilter: string;
  setAlcoholFilter: (value: string) => void;
  drugsFilter: string;
  setDrugsFilter: (value: string) => void;
  pedestrianFilter: string;
  setPedestrianFilter: (value: string) => void;
  deadFilter: string;
  setDeadFilter: (value: string) => void;
  onUpdateData?: () => void;
  realAngle: boolean; // smazat
  setRealAngle: (value: boolean) => void; // smazat
  isRadarActive: string;
  setIsRadarActive: (value: string) => void;
  showAccidentsHeatmap: boolean;
  setShowAccidentsHeatmap: (value: boolean) => void;
  showMeasureHeatmap: boolean;
  setShowMeasureHeatmap: (value: boolean) => void;
  numberOfRadars: number;
  numberOfAccidents: number;
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
  alcoholFilter,
  setAlcoholFilter,
  drugsFilter,
  setDrugsFilter,
  pedestrianFilter,
  setPedestrianFilter,
  deadFilter,
  setDeadFilter,
  onUpdateData,
  realAngle, // smazat
  setRealAngle, // smazat
  isRadarActive,
  setIsRadarActive,
  showAccidentsHeatmap,
  setShowAccidentsHeatmap,
  showMeasureHeatmap,
  setShowMeasureHeatmap,
  numberOfRadars,
  numberOfAccidents,
}) => {
  const [days, setDays] = useState<string[]>([]);
  const [accidentsFilter, setAccidentsFilter] = useState(false); // podrobnější nehody
  const [radarsFilter, setRadarsFilter] = useState(false); // podrobnější radary
  const [resetRotating, setResetRotating] = useState(false);
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

  // reset filtru pro nehody
  const resetAccidentsFilter = () => {
    setDeadFilter("-");
    setPedestrianFilter("-");
    setDrugsFilter("-");
    setAlcoholFilter("-");
    setSelectedMonth("all");
    setSelectedDay("all");
    setSelectedYear(new Date().getFullYear().toString());
    setShowAccidentsHeatmap(false);
  };

  return (
    <div
      className={`flex flex-col items-start p-5 bg-[#C8E6C9] border-2 border-[#66BB6A] rounded-[30px] shadow-md text-[#388E3C] opacity-80 whitespace-nowrap transition-all duration-500 ${
        isFiltersVisible ? "max-w-[350px]" : "max-w-[10px]"
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
        {/** radary */}
        <div className="flex flex-row items-center gap-2">
          <ButtonToggle
            showData={showRadarData}
            toggleGeoJsonVisibility={() => setShowRadarData(!showRadarData)}
            toggleDetailVisibility={() => setRadarsFilter(!radarsFilter)}
            toggleHeatmapVisibility={() =>
              setShowMeasureHeatmap(!showMeasureHeatmap)
            }
            rotation={radarsFilter}
            count={numberOfRadars}
            label="Radary"
          />
          {/** smazat směr button*/}
          {/*<button onClick={() => setRealAngle(!realAngle)}>
            {realAngle ? "směr: ano" : "směr: ne"}
          </button>*/}
        </div>
        {/** detail radaru */}
        <AnimatePresence>
          {radarsFilter && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="ml-6 overflow-hidden"
            >
              {/** aktivita radaru TODO*/}
              <div className="flex items-center gap-2">
                <label htmlFor="aktivita-radaru">Aktivní radary:</label>
                <select
                  id="aktivita-radaru"
                  value={isRadarActive}
                  onChange={(e) => setIsRadarActive(e.target.value)}
                  className="border rounded w-20"
                >
                  {activeRadarOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/** nehody */}
        <ButtonToggle
          showData={showAccidentData}
          toggleGeoJsonVisibility={() => setShowAccidentData(!showAccidentData)}
          toggleDetailVisibility={() => setAccidentsFilter(!accidentsFilter)}
          toggleHeatmapVisibility={() =>
            setShowAccidentsHeatmap(!showAccidentsHeatmap)
          }
          rotation={accidentsFilter}
          count={numberOfAccidents}
          label="Nehody"
        />

        {/** edit vzhled */}
        <button onClick={resetAccidentsFilter}>reset</button>

        {/* detail nehod */}
        <AnimatePresence>
          {accidentsFilter && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="ml-6 overflow-hidden"
            >
              <div className="flex flex-row gap-2">
                {/* Výběr roku */}
                <CustomSelect
                  options={years.map(String)}
                  value={selectedYear}
                  onChange={(option) => setSelectedYear(option)}
                />

                {/* Výběr měsíce */}
                <CustomSelect
                  options={months}
                  value={selectedMonth === "all" ? "mm" : selectedMonth}
                  onChange={(option) => setSelectedMonth(option)}
                />

                {/* Výběr dne */}
                <CustomSelect
                  options={days}
                  value={selectedDay === "all" ? "dd" : selectedDay}
                  onChange={(option) => setSelectedDay(option)}
                />
              </div>

              {/* Alkohol u viníka */}
              <div className="flex items-center gap-2">
                <label htmlFor="alkohol-u-vinika">Alkohol u viníka:</label>
                <select
                  id="alkohol-u-vinika"
                  value={alcoholFilter}
                  onChange={(e) => setAlcoholFilter(e.target.value)}
                  className="border rounded w-20"
                >
                  {alcoholOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Drogy u viníka */}
              <div className="flex items-center gap-2">
                <label htmlFor="drogy-u-vinika">Drogy u viníka:</label>
                <select
                  id="drogy-u-vinika"
                  value={drugsFilter}
                  onChange={(e) => setDrugsFilter(e.target.value)}
                  className="border rounded w-20"
                >
                  {drugsOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* účast chodce */}
              <div className="flex items-center gap-2">
                <label htmlFor="ucast-chodce">Účast chodce:</label>
                <select
                  id="ucast-chodce"
                  value={pedestrianFilter}
                  onChange={(e) => setPedestrianFilter(e.target.value)}
                  className="border rounded w-20"
                >
                  {pedestrianOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* smrtelná nehoda */}
              <div className="flex items-center gap-2">
                <label htmlFor="smrtelna-nehoda">Smrtelná nehoda:</label>
                <select
                  id="smrtelna-nehoda"
                  value={deadFilter}
                  onChange={(e) => setDeadFilter(e.target.value)}
                  className="border rounded w-20"
                >
                  {consequenceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <ButtonToggle
          showData={showTrafficData}
          toggleGeoJsonVisibility={() => setShowTrafficData(!showTrafficData)}
          label="Dopravní situace"
        />
        {/* Tlačítko pro aktualizaci dat TODO*/}
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
