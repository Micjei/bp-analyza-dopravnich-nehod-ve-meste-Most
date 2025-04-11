import React, { useEffect, useState } from "react";
import ButtonToggle from "./ButtonToggle";
import ResetButton from "./ResetButton";
import "primereact/resources/themes/lara-light-indigo/theme.css"; // Téma pro slider
import "primereact/resources/primereact.min.css"; // Základní styly pro všechny komponenty PrimeReact
import { motion, AnimatePresence, view } from "framer-motion";
import {
  getCurrentYear,
  years,
  getDaysInMonth,
  isLeapYear,
  alcoholOptions,
  drugsOptions,
  pedestrianOptions,
  consequenceOptions,
  viewOptions,
  activeRadarOptions,
  measureViewOptions,
} from "@/utils/selectOptions";
import "primeicons/primeicons.css";
import CustomSelect from "./CustomSelect";
import { useTranslation } from "react-i18next";
import "@/i18n"; // Import konfigurace i18n

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
  //onUpdateData?: () => void;
  //realAngle: boolean; // smazat
  //setRealAngle: (value: boolean) => void; // smazat
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
  //onUpdateData,
  //realAngle, // smazat
  //setRealAngle, // smazat
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
  const { t } = useTranslation();

  // Funkce pro aktualizaci počtu dnů při změně měsíce nebo roku
  useEffect(() => {
    const month = parseInt(selectedMonth);
    const year = parseInt(selectedYear);
    const numberOfDays = getDaysInMonth(month, year);

    // Generování seznamu dnů na základě měsíce a roku
    const daysList = [
      "-",
      ...Array.from({ length: numberOfDays }, (_, i) => (i + 1).toString()),
    ];
    setDays(daysList);

    if (parseInt(selectedDay) > numberOfDays) {
      setSelectedDay("-");
    }
  }, [selectedMonth, selectedYear, selectedDay, setSelectedDay]);

  const months = [
    "-",
    ...Array.from({ length: 12 }, (_, i) => (i + 1).toString()),
  ];

  // reset filtru pro nehody
  const handleAccidentReset = () => {
    setDeadFilter("-");
    setPedestrianFilter("-");
    setDrugsFilter("-");
    setAlcoholFilter("-");
    setSelectedMonth("-");
    setSelectedDay("-");
    setSelectedYear(new Date().getFullYear().toString());
    setShowAccidentsHeatmap(false);
  };

  const handleRadarReset = () => {
    setIsRadarActive("-");
    setShowMeasureHeatmap(false);
  };

  return (
    <div
      className={`flex flex-col items-start p-5 bg-filters-bg border-2 border-filters-border rounded-[30px] shadow-md text-filters-text opacity-80 md:whitespace-nowrap overflow-hidden overflow-y-auto scrollbar-hide transition-all duration-500 ${
        isFiltersVisible
          ? "md:w-[35vw] md:max-h-[70vh] max-h-[50vh] w-[calc(100vw-30px)]"
          : "w-[3vw] md:max-h-[70vh] max-h-[50vh]"
      }`}
    >
      {/* Nadpis */}
      <h3
        className={`self-center transition-opacity duration-300 text-1xl font-bold ${
          isFiltersVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {`${t("filter_title")}`}
      </h3>

      {/* Zelená čára pod nadpisem */}
      <div
        className={`w-[calc(100%+2.5rem)] -mx-5  border-b-2 border-filters-border mb-5 mt-2 transition-opacity duration-300 ${
          isFiltersVisible ? "opacity-100" : "opacity-0"
        }`}
      ></div>

      {/* Obsah */}

      <div
        className={`transition-opacity duration-300 w-full ${
          isFiltersVisible
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/** radary */}
        <ButtonToggle
          showData={showRadarData}
          toggleGeoJsonVisibility={() => setShowRadarData(!showRadarData)}
          toggleDetailVisibility={() => setRadarsFilter(!radarsFilter)}
          rotation={radarsFilter} // detaily šipka
          label={`${t("radars")}`}
          onReset={handleRadarReset}
        />
        {/** detail radaru */}
        <AnimatePresence>
          {radarsFilter && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="ml-6 overflow-visible"
            >
              {/** aktivita radaru TODO*/}
              <div className="flex items-center gap-2">
                <CustomSelect
                  options={activeRadarOptions(t)}
                  value={isRadarActive}
                  onChange={(option) => setIsRadarActive(option)}
                />
                <label htmlFor="aktivita-radaru">
                  - {`${t("active_radars")}`}
                </label>
              </div>
              {/** měření */}
              <div className="flex items-center gap-2">
                <CustomSelect
                  options={measureViewOptions(t)}
                  value={showMeasureHeatmap ? `${t("yes")}` : `${t("no")}`}
                  onChange={(option) =>
                    setShowMeasureHeatmap(option === `${t("yes")}`)
                  }
                />
                <label htmlFor="measure-heat-map">
                  - {`${t("display_measure")}`}
                </label>
              </div>
              {/**počet zobrazených dat */}
              <div className="flex flex-row gap-2">
                <div className="px-2 text-left ">{numberOfRadars}</div>-{" "}
                {`${t("view_number")}`}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className={`w-full justify-self-center -mx-5  border-b-2 border-filters-border mb-3 mt-3 transition-opacity duration-300 ${
            isFiltersVisible ? "opacity-100" : "opacity-0"
          }`}
        ></div>

        {/** nehody */}
        <ButtonToggle
          showData={showAccidentData}
          toggleGeoJsonVisibility={() => setShowAccidentData(!showAccidentData)}
          toggleDetailVisibility={() => setAccidentsFilter(!accidentsFilter)}
          rotation={accidentsFilter}
          label={`${t("accidents")}`}
          onReset={handleAccidentReset}
        />

        {/* detail nehod */}
        <AnimatePresence>
          {accidentsFilter && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="ml-6 overflow-visible"
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
                  value={selectedMonth === "-" ? "mm" : selectedMonth}
                  onChange={(option) => {
                    setSelectedMonth(option);
                    if (option === "-") {
                      setSelectedDay("-");
                      setDays(["-"]);
                    }
                  }}
                />

                {/* Výběr dne */}
                <CustomSelect
                  options={days}
                  value={selectedDay === "-" ? "dd" : selectedDay}
                  onChange={(option) => setSelectedDay(option)}
                />
              </div>
              {/* Alkohol u viníka */}
              <div className="flex items-center gap-2">
                <CustomSelect
                  options={alcoholOptions(t)}
                  value={alcoholFilter}
                  onChange={(option) => setAlcoholFilter(option)}
                />
                <label htmlFor="alkohol-u-vinika">- {`${t("alcohol")}`}</label>
              </div>
              {/* Drogy u viníka */}
              <div className="flex items-center gap-2">
                <CustomSelect
                  options={drugsOptions(t)}
                  value={drugsFilter}
                  onChange={(option) => setDrugsFilter(option)}
                />
                <label htmlFor="drogy-u-vinika">- {`${t("drugs")}`}</label>
              </div>
              {/* účast chodce */}
              <div className="flex items-center gap-2">
                <CustomSelect
                  options={pedestrianOptions(t)}
                  value={pedestrianFilter}
                  onChange={(option) => setPedestrianFilter(option)}
                />
                <label htmlFor="ucast-chodce">
                  - {`${t("pedestrian_participation")}`}
                </label>
              </div>
              {/* smrtelná nehoda */}
              <div className="flex items-center gap-2">
                <CustomSelect
                  options={consequenceOptions(t)}
                  value={deadFilter}
                  onChange={(option) => setDeadFilter(option)}
                />
                <label htmlFor="smrtelna-nehoda">- {`${t("fatal")}`}</label>
              </div>
              {/* zobrazení */}
              <div className="flex items-center gap-2">
                <CustomSelect
                  options={viewOptions(t)}
                  value={
                    showAccidentsHeatmap ? `${t("heatmap")}` : `${t("normal")}`
                  }
                  onChange={(option) =>
                    setShowAccidentsHeatmap(option === `${t("heatmap")}`)
                  }
                />
                <label htmlFor="heat-map">- {`${t("display")}`}</label>
              </div>
              {/**počet zobrazených dat */}
              <div className="flex flex-row gap-2">
                <div className=" px-2 text-left ">{numberOfAccidents}</div>-{" "}
                {`${t("view_number")}`}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className={`w-full justify-self-center -mx-5  border-b-2 border-filters-border mb-3 mt-3 transition-opacity duration-300 ${
            isFiltersVisible ? "opacity-100" : "opacity-0"
          }`}
        ></div>

        <ButtonToggle
          showData={showTrafficData}
          toggleGeoJsonVisibility={() => setShowTrafficData(!showTrafficData)}
          label={`${t("traffic_situation")}`}
        />
        {/* Tlačítko pro aktualizaci dat TODO*/}
        {/*<button
          onClick={onUpdateData}
          className="mt-4 bg-[#66BB6A] text-white px-4 py-2 rounded-[30px] shadow hover:bg-[#558b55] w-full"
        >
          {`${t("update")}`}
        </button>*/}
      </div>
    </div>
  );
};

export default FilterSection;
