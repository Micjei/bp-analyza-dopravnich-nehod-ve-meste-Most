import { motion } from "framer-motion";

import React from "react";
import { useTranslation } from "react-i18next";
import "@/i18n"; // Import konfigurace i18n

interface ButtonToggleProps {
  showData: boolean;
  toggleGeoJsonVisibility: () => void;
  toggleDetailVisibility?: () => void;
  toggleHeatmapVisibility?: () => void; // smazat
  rotation?: boolean;
  label: string;
}

const ButtonToggle: React.FC<ButtonToggleProps> = ({
  showData,
  toggleGeoJsonVisibility,
  toggleDetailVisibility,
  toggleHeatmapVisibility, // smazat
  rotation,
  label,
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center cursor-pointer mb-1 gap-2 ">
      <div
        onClick={toggleGeoJsonVisibility}
        className="flex items-center cursor-pointer hover:text-green-900"
      >
        <div
          className={`w-5 h-5 rounded-sm mr-2 transition-colors duration-300 ${
            showData ? "bg-green-500" : "bg-white"
          } border `}
        ></div>
        <span>{label}</span>
      </div>
      {/** zobrazení detailů */}
      {toggleDetailVisibility && (
        <button
          onClick={toggleDetailVisibility}
          className="px-2 flex items-center hover:text-green-900 gap-1 transition-all"
        >
          {`${t("details")}`}
          {/* Šipka dolů */}
          <span
            className={`transform transition-transform duration-[700ms] ${
              rotation ? "rotate-[540deg]" : "rotate-0"
            }`}
          >
            &#8595;
          </span>
        </button>
      )}
      {/* Ikona pro HeatMap */}
      {toggleHeatmapVisibility && (
        <button
          onClick={toggleHeatmapVisibility}
          className="flex items-center hover:text-green-900 transition-all"
        >
          <div className="flex items-center">
            <img src="../heatmap.png" alt="Heatmap Icon" className="w-5 h-5" />
          </div>
        </button>
      )}
    </div>
  );
};

export default ButtonToggle;
