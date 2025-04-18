import { motion } from "framer-motion";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "@/i18n"; // Import konfigurace i18n
import ResetButton from "./ResetButton";

interface ButtonToggleProps {
  showData: boolean;
  toggleGeoJsonVisibility: () => void;
  toggleDetailVisibility?: () => void;
  rotation?: boolean;
  label: string;
  onReset?: () => void;
}

const ButtonToggle: React.FC<ButtonToggleProps> = ({
  showData,
  toggleGeoJsonVisibility,
  toggleDetailVisibility,
  rotation,
  label,
  onReset,
}) => {
  const { t } = useTranslation();
  const [showReset, setShowReset] = useState(false);
  return (
    <div className="flex items-center mb-1 gap-2">
      <div
        onClick={() => {
          setShowReset(!showReset);
          toggleGeoJsonVisibility();

          if (toggleDetailVisibility) {
            toggleDetailVisibility();
          }
        }}
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
      {/*toggleDetailVisibility && (
        <button
          onClick={toggleDetailVisibility}
          className="px-2 flex items-center hover:text-green-900 gap-1 transition-all"
        >
          {`${t("details")}`}
          {/* Šipka dolů }
          <span
            className={`transform transition-transform duration-[700ms] ${
              rotation ? "rotate-[540deg]" : "rotate-0"
            }`}
          >
            &#8595;
          </span>
        </button>
      )*/}
      {/* Reset button zarovnaný doprava */}
      {showReset && onReset && (
        <div>
          <ResetButton onClick={onReset} />
        </div>
      )}
    </div>
  );
};

export default ButtonToggle;
