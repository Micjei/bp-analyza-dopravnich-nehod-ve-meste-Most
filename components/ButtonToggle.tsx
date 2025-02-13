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
      style={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        marginBottom: "10px",
      }}
    >
      <div
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "3px",
          marginRight: "10px",
          backgroundColor: showData ? "green" : "white",
          transition: "background-color 0.3s",
        }}
      ></div>
      <span>{label}</span>
    </div>
  );
};

export default ButtonToggle;
