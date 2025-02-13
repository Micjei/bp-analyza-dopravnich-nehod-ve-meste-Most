import React from "react";
import ButtonToggle from "./ButtonToggle";

interface FilterSectionProps {
  showRadarData: boolean;
  setShowRadarData: (value: boolean) => void;
  showOtherData: boolean;
  setShowOtherData: (value: boolean) => void;
  isFiltersVisible: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  showRadarData,
  setShowRadarData,
  showOtherData,
  setShowOtherData,
  isFiltersVisible,
}) => {
  return (
    <div
      style={{
        marginBottom: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "20px",
        backgroundColor: "#C8E6C9",
        border: "2px solid #66BB6A",
        borderRadius: "40px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        color: "#388E3C",
        opacity: "80%",
        width: isFiltersVisible ? "auto" : "10px",
        overflow: "hidden",
      }}
    >
      {/* Nadpis */}
      <h3
        style={{
          alignSelf: "center",
          visibility: isFiltersVisible ? "visible" : "hidden",
        }}
      >
        Filtry
      </h3>

      {/* Zelená čára pod nadpisem */}
      <div
        style={{
          width: "100%",
          borderBottom: "2px solid #66BB6A",
          marginBottom: "20px",
          marginTop: "10px",
          visibility: isFiltersVisible ? "visible" : "hidden",
        }}
      />

      {/* Obsah */}
      <div style={{ visibility: isFiltersVisible ? "visible" : "hidden" }}>
        <ButtonToggle
          showData={showRadarData}
          toggleGeoJsonVisibility={() => setShowRadarData(!showRadarData)}
          label="Radary"
        />
        <ButtonToggle
          showData={showOtherData}
          toggleGeoJsonVisibility={() => setShowOtherData(!showOtherData)}
          label="Jiná Data"
        />
      </div>
    </div>
  );
};

export default FilterSection;
