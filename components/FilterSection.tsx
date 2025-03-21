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
  options: string[] | { label: string; value: string }[]; // Může být pole stringů nebo objektů { label, value }
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

  // Funkce pro získání labelu z option (pokud je to objekt)
  const getLabel = (option: string | { label: string; value: string }) => {
    if (typeof option === "string") {
      return option; // Pokud je option string, vrátíme ji přímo
    }
    return option.label; // Pokud je option objekt, vrátíme label
  };

  // Funkce pro zjištění, zda je option objekt (s label a value) nebo string
  const isOptionObject = (
    option: string | { label: string; value: string }
  ): option is { label: string; value: string } => {
    return typeof option !== "string";
  };

  const handleClick = (option: string | { label: string; value: string }) => {
    if (typeof option === "string") {
      onChange(option); // Pokud je option string, předáme ho přímo
    } else {
      onChange(option.value); // Pokud je option objekt, předáme value
    }
    setIsOpen(false);
  };

  // Funkce pro získání labelu pro aktuálně vybranou hodnotu
  const getSelectedLabel = () => {
    // Zde upravujeme logiku pro "mm" nebo "dd", když je selectedMonth nebo selectedDay "all"
    if (value === "mm" || value === "dd") {
      return value === "mm" ? "mm" : "dd"; // Pokud je value "mm" nebo "dd", vrátí odpovídající label
    }

    if (!value) return ""; // Pokud není vybraná žádná hodnota, vrátí prázdný text

    const selectedOption = options.find(
      (option) => (typeof option === "string" ? option : option.value) === value
    );
    return selectedOption ? getLabel(selectedOption) : ""; // Pokud nenalezne hodnotu, vrátí prázdný text
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={selectRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="border-2 border-[#ffffff] rounded px-2 text-left hover:bg-slate-50 active:bg-gray-300 active:scale-95"
      >
        {getSelectedLabel()} {/* Zobrazení labelu podle value */}
      </button>

      {isOpen && (
        <div
          className="fixed flex items-center justify-center z-[1000]"
          onClick={() => setIsOpen(false)} // Zavření při kliknutí mimo
        >
          <div
            className="w-max bg-white border rounded shadow-lg p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: isOptionObject(options[0])
                  ? `repeat(${Math.min(options.length, 3)}, minmax(40px, 1fr))`
                  : `repeat(${Math.min(options.length, 7)}, minmax(40px, 1fr))`,
              }}
            >
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleClick(option)}
                  className="border rounded p-2 text-center hover:bg-gray-200"
                >
                  {getLabel(option)} {/* Zobrazení labelu */}
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

  const [rotation, setRotation] = useState(0);
  const handleClick = () => {
    setRotation((prev) => prev - 360);
    resetAccidentsFilter();
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
                <CustomSelect
                  options={activeRadarOptions}
                  value={isRadarActive}
                  onChange={(option) => setIsRadarActive(option)}
                />
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
                  onChange={(option) => {
                    setSelectedMonth(option);
                    if (option === "all") {
                      setSelectedDay("all");
                      setDays(["all"]);
                    }
                  }}
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
                <CustomSelect
                  options={alcoholOptions}
                  value={alcoholFilter}
                  onChange={(option) => setAlcoholFilter(option)}
                />
              </div>

              {/* Drogy u viníka */}
              <div className="flex items-center gap-2">
                <label htmlFor="drogy-u-vinika">Drogy u viníka:</label>
                <CustomSelect
                  options={drugsOptions}
                  value={drugsFilter}
                  onChange={(option) => setDrugsFilter(option)}
                />
              </div>

              {/* účast chodce */}
              <div className="flex items-center gap-2">
                <label htmlFor="ucast-chodce">Účast chodce:</label>
                <CustomSelect
                  options={pedestrianOptions}
                  value={pedestrianFilter}
                  onChange={(option) => setPedestrianFilter(option)}
                />
              </div>

              {/* smrtelná nehoda */}
              <div className="flex items-center gap-2">
                <label htmlFor="smrtelna-nehoda">Smrtelná nehoda:</label>
                <CustomSelect
                  options={consequenceOptions}
                  value={deadFilter}
                  onChange={(option) => setDeadFilter(option)}
                />
              </div>

              {/** edit vzhled */}
              <button
                onClick={handleClick}
                className="p-2 hover:opacity-80 transition-transform"
              >
                <img
                  src="/refresh.png"
                  alt="Reset"
                  className="w-6 h-6 transition-transform duration-700"
                  style={{ transform: `rotate(${rotation}deg)` }}
                />
              </button>
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
