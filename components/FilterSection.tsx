import React, { useEffect, useState, useRef } from "react";
import ButtonToggle from "./ButtonToggle";
import ResetButton from "./ResetButton";
import "primereact/resources/themes/lara-light-indigo/theme.css"; // Theme for PrimeReact components
import "primereact/resources/primereact.min.css"; // Base styles for PrimeReact
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
  viewOptions,
  activeRadarOptions,
  measureViewOptions,
} from "@/utils/selectOptions";

import "primeicons/primeicons.css";
import CustomSelect from "./CustomSelect";
import { useTranslation } from "react-i18next";
import "@/i18n"; // i18n config

// Props definition
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
  isRadarActive: string;
  setIsRadarActive: (value: string) => void;
  showAccidentsHeatmap: boolean;
  setShowAccidentsHeatmap: (value: boolean) => void;
  showMeasureHeatmap: boolean;
  setShowMeasureHeatmap: (value: boolean) => void;
  numberOfRadars: number;
  numberOfAccidents: number;
}

// Main component
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
  isRadarActive,
  setIsRadarActive,
  showAccidentsHeatmap,
  setShowAccidentsHeatmap,
  showMeasureHeatmap,
  setShowMeasureHeatmap,
  numberOfRadars,
  numberOfAccidents,
}) => {
  const [days, setDays] = useState<string[]>([]); // Available days for selected month/year
  const [accidentsFilter, setAccidentsFilter] = useState(false); // Show accident details
  const [radarsFilter, setRadarsFilter] = useState(false); // Show radar details
  const { t } = useTranslation();

  // Update days dropdown when month or year changes
  useEffect(() => {
    const month = parseInt(selectedMonth);
    const year = parseInt(selectedYear);
    const numberOfDays = getDaysInMonth(month, year);

    const daysList = [
      "-",
      ...Array.from({ length: numberOfDays }, (_, i) => (i + 1).toString()),
    ];
    setDays(daysList);

    if (parseInt(selectedDay) > numberOfDays) {
      setSelectedDay("-");
    }
  }, [selectedMonth, selectedYear, selectedDay, setSelectedDay]);

  // Month options
  const months = [
    "-",
    ...Array.from({ length: 12 }, (_, i) => (i + 1).toString()),
  ];

  // Reset filters for accidents
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

  // Reset filters for radars
  const handleRadarReset = () => {
    setIsRadarActive("-");
    setShowMeasureHeatmap(false);
  };

  const [isLandscape, setIsLandscape] = useState(false);

  // Detect screen orientation
  useEffect(() => {
    const mediaQuery = window.matchMedia("(orientation: landscape)");

    const handleOrientationChange = (e: MediaQueryListEvent) => {
      setIsLandscape(e.matches);
    };

    setIsLandscape(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleOrientationChange);
    return () => {
      mediaQuery.removeEventListener("change", handleOrientationChange);
    };
  }, []);

  // Scroll to top when filters panel is collapsed
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isFiltersVisible && containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [isFiltersVisible]);

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col items-start p-5 bg-filters-bg border-2 border-filters-border rounded-[30px] shadow-md text-filters-text opacity-80 
        ${isFiltersVisible ? "overflow-y-auto" : "overflow-hidden"}
        overflow-x-hidden scrollbar-hide transition-all duration-500
        ${
          isFiltersVisible
            ? isLandscape
              ? "lg:w-[35vw] lg:max-h-[70vh] max-h-[50vh] w-[50vw]"
              : "md:w-[35vw] md:max-h-[70vh] max-h-[40vh] w-[calc(100vw-35px)]"
            : "w-[3vw] md:max-h-[70vh] max-h-[50vh]"
        }`}
    >
      {/* Title "Filters" when collapsed */}
      {!isFiltersVisible && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center justify-center text-center text-sm font-semibold text-filters-text leading-tight tracking-wide uppercase">
            {`${t("filter_title")}`.split("").map((char, index) => (
              <span key={index}>{char}</span>
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      <h3
        className={`self-center transition-opacity duration-300 text-1xl font-bold ${
          isFiltersVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {t("filter_title")}
      </h3>

      {/* Divider under header */}
      <div
        className={`w-[calc(100%+2.5rem)] -mx-5  border-b-2 border-filters-border mb-5 mt-2 transition-opacity duration-300 ${
          isFiltersVisible ? "opacity-100" : "opacity-0"
        }`}
      ></div>

      {/* Main filter content */}
      <div
        className={`transition-opacity duration-300 w-full ${
          isFiltersVisible
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Radar toggle */}
        <ButtonToggle
          showData={showRadarData}
          toggleGeoJsonVisibility={() => setShowRadarData(!showRadarData)}
          toggleDetailVisibility={() => setRadarsFilter(!radarsFilter)}
          label={t("radars")}
          onReset={handleRadarReset}
        />

        {/* Radar details */}
        <AnimatePresence>
          {radarsFilter && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="ml-6 overflow-visible"
            >
              {/* Active radars filter */}
              <div className="flex items-center gap-2">
                <CustomSelect
                  options={activeRadarOptions(t)}
                  value={isRadarActive}
                  onChange={(option) => setIsRadarActive(option)}
                />
                <label>- {t("active_radars")}</label>
              </div>

              {/* Radar heatmap toggle */}
              <div className="flex items-center gap-2">
                <CustomSelect
                  options={measureViewOptions(t)}
                  value={showMeasureHeatmap ? t("yes") : t("no")}
                  onChange={(option) =>
                    setShowMeasureHeatmap(option === t("yes"))
                  }
                />
                <label>- {t("display_measure")}</label>
              </div>

              {/* Displayed radar count */}
              <div className="flex flex-row gap-2">
                <div className="px-2 text-left">{numberOfRadars}</div>-{" "}
                {t("view_number")}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Divider */}
        <div className="w-full -mx-5 border-b-2 border-filters-border my-3" />

        {/* Accidents toggle */}
        <ButtonToggle
          showData={showAccidentData}
          toggleGeoJsonVisibility={() => setShowAccidentData(!showAccidentData)}
          toggleDetailVisibility={() => setAccidentsFilter(!accidentsFilter)}
          label={t("accidents")}
          onReset={handleAccidentReset}
        />

        {/* Accident details */}
        <AnimatePresence>
          {accidentsFilter && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="ml-6 overflow-visible"
            >
              {/* Year / Month / Day selectors */}
              <div className="flex flex-row gap-2">
                <CustomSelect
                  options={["-", ...years.map(String)]}
                  value={selectedYear === "-" ? t("yy") : selectedYear}
                  onChange={setSelectedYear}
                />
                <CustomSelect
                  options={months}
                  value={selectedMonth === "-" ? t("mm") : selectedMonth}
                  onChange={(option) => {
                    setSelectedMonth(option);
                    if (option === "-") {
                      setSelectedDay("-");
                      setDays(["-"]);
                    }
                  }}
                />
                <CustomSelect
                  options={days}
                  value={selectedDay === "-" ? t("dd") : selectedDay}
                  onChange={setSelectedDay}
                />
              </div>

              {/* Alcohol filter */}
              <div className="flex items-center gap-2">
                <CustomSelect
                  options={alcoholOptions(t)}
                  value={alcoholFilter}
                  onChange={setAlcoholFilter}
                />
                <label>- {t("alcohol")}</label>
              </div>

              {/* Drugs filter */}
              <div className="flex items-center gap-2">
                <CustomSelect
                  options={drugsOptions(t)}
                  value={drugsFilter}
                  onChange={setDrugsFilter}
                />
                <label>- {t("drugs")}</label>
              </div>

              {/* Pedestrian filter */}
              <div className="flex items-center gap-2">
                <CustomSelect
                  options={pedestrianOptions(t)}
                  value={pedestrianFilter}
                  onChange={setPedestrianFilter}
                />
                <label>- {t("pedestrian_participation")}</label>
              </div>

              {/* Fatal accident filter */}
              <div className="flex items-center gap-2">
                <CustomSelect
                  options={consequenceOptions(t)}
                  value={deadFilter}
                  onChange={setDeadFilter}
                />
                <label>- {t("fatal")}</label>
              </div>

              {/* Display mode selector (heatmap or normal) */}
              <div className="flex items-center gap-2">
                <CustomSelect
                  options={viewOptions(t)}
                  value={showAccidentsHeatmap ? t("heatmap") : t("normal")}
                  onChange={(option) =>
                    setShowAccidentsHeatmap(option === t("heatmap"))
                  }
                />
                <label>- {t("display")}</label>
              </div>

              {/* Displayed accident count */}
              <div className="flex flex-row gap-2">
                <div className="px-2 text-left">{numberOfAccidents}</div>-{" "}
                {t("view_number")}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Divider */}
        <div className="w-full -mx-5 border-b-2 border-filters-border my-3" />

        {/* Traffic toggle */}
        <ButtonToggle
          showData={showTrafficData}
          toggleGeoJsonVisibility={() => setShowTrafficData(!showTrafficData)}
          label={t("traffic_situation")}
        />
      </div>
    </div>
  );
};

export default FilterSection;
