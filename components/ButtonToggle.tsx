// React and state management
import React, { useState } from "react";

// Translation hook
import { useTranslation } from "react-i18next";
import "@/i18n"; // i18n configuration

// Custom Reset button component
import ResetButton from "./ResetButton";

// Props type definition
interface ButtonToggleProps {
  showData: boolean; // Whether the data is currently shown
  toggleGeoJsonVisibility: () => void; // Function to toggle the visibility of GeoJSON layer
  toggleDetailVisibility?: () => void; // Optional function to toggle detail section
  label: string; // Label text for the toggle
  onReset?: () => void; // Optional reset handler
}

// Functional component
const ButtonToggle: React.FC<ButtonToggleProps> = ({
  showData,
  toggleGeoJsonVisibility,
  toggleDetailVisibility,
  label,
  onReset,
}) => {
  const { t } = useTranslation(); // Get translation function
  const [showReset, setShowReset] = useState(false); // Local state to show/hide reset button

  return (
    <div className="flex items-center mb-1 gap-2">
      {/* Main clickable area that toggles data visibility and optional details */}
      <div
        onClick={() => {
          setShowReset(!showReset); // Toggle reset button visibility
          toggleGeoJsonVisibility(); // Toggle main GeoJSON layer

          // If available, also toggle additional details
          if (toggleDetailVisibility) {
            toggleDetailVisibility();
          }
        }}
        className="flex items-center cursor-pointer hover:text-green-900"
      >
        {/* Colored square indicating active/inactive state */}
        <div
          className={`w-5 h-5 rounded-sm mr-2 transition-colors duration-300 ${
            showData ? "bg-green-500" : "bg-white"
          } border `}
        ></div>

        {/* Label for the toggle */}
        <span>{label}</span>
      </div>

      {/* Conditionally shown reset button */}
      {showReset && onReset && (
        <div>
          <ResetButton onClick={onReset} />
        </div>
      )}
    </div>
  );
};

export default ButtonToggle;
