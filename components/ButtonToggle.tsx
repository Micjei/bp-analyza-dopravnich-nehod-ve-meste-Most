import React from "react";
interface ButtonToggleProps {
  showData: boolean;
  toggleGeoJsonVisibility: () => void;
  toggleDetailVisibility?: () => void;
  accidentFilter?: boolean;
  label: string;
}

const ButtonToggle: React.FC<ButtonToggleProps> = ({
  showData,
  toggleGeoJsonVisibility,
  toggleDetailVisibility,
  accidentFilter,
  label,
}) => {
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
          Detail
          {/* Šipka dolů */}
          <span
            className={`transform transition-transform ${
              accidentFilter ? "rotate-180" : "rotate-0"
            }`}
          >
            &#8595;
          </span>
        </button>
      )}
    </div>
  );
};

export default ButtonToggle;
