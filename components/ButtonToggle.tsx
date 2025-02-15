// ButtonToggle.tsx
import React from "react";

interface ButtonToggleProps {
  showData: boolean;
  toggleGeoJsonVisibility: () => void;
  label: string;
}

const ButtonToggle: React.FC<ButtonToggleProps> = ({
  showData,
  toggleGeoJsonVisibility,
  label,
}) => {
  return (
    <div
      onClick={toggleGeoJsonVisibility}
      className="flex items-center cursor-pointer mb-3"
    >
      <div
        className={`w-5 h-5 rounded-sm mr-2 transition-colors duration-300 ${
          showData ? "bg-green-500" : "bg-white"
        }`}
      ></div>
      <span>{label}</span>
    </div>
  );
};

export default ButtonToggle;
