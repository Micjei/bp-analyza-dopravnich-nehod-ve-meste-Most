import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "../../app/globals.css";
import ButtonToggle from "../ButtonToggle";
import FilterSection from "../FilterSection";

const Map: React.FC = () => {
  const position: LatLngExpression = [50.503056, 13.636667];
  const [RadarsData, setRadarsData] = useState<any>(null);
  const [showRadars, setShowRadars] = useState<boolean>(false);
  const [otherGeoJsonData, setOtherGeoJsonData] = useState<any>(null);
  const [showOtherData, setShowOtherData] = useState(false);

  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    fetch("data/radary.geojson")
      .then((response) => response.json())
      .then((data) => setRadarsData(data))
      .catch((error) => console.error("Chyba při načítání GeoJSON:", error));

    fetch("data/otherData.geojson")
      .then((response) => response.json())
      .then((data) => setOtherGeoJsonData(data))
      .catch((error) =>
        console.error("Chyba při načítání jiných dat GeoJSON:", error)
      );
  }, []);

  const [showRadarData, setShowRadarData] = useState(false);
  const [showOtherDataFilter, setShowOtherDataFilter] = useState(false);

  const pointToLayerRadars = (feature: any, latlng: LatLngExpression) => {
    return L.circleMarker(latlng, {
      radius: 8,
      fillColor: "blue",
      color: "white",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.7,
    });
  };

  const pointToLayerOthers = (feature: any, latlng: LatLngExpression) => {
    return L.circleMarker(latlng, {
      radius: 8,
      fillColor: "red",
      color: "white",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.7,
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: "100%",
        position: "relative",
      }}
    >
      {/* Rodičovský kontejner pro mapu */}
      <div style={{ width: "100%", height: "600px", position: "relative" }}>
        {/* Sekce filtrů s možností skrytí/odkrytí */}
        <div
          style={{
            position: "absolute",
            top: "200px",
            left: "20px",
            zIndex: 1000,
          }}
        >
          <FilterSection
            showRadarData={showRadarData}
            setShowRadarData={setShowRadarData}
            showOtherData={showOtherDataFilter}
            setShowOtherData={setShowOtherDataFilter}
            isFiltersVisible={showFilters}
          />

          {/* Tlačítko pro zobrazení a skrytí filtrů */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              position: "absolute",
              top: "50%",
              left: "100%",
              transform: "translateY(-50%)",
              backgroundColor: "#C8E6C9",
              color: "#388E3C",
              padding: "10px",
              borderRadius: "20%",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
            }}
          >
            {showFilters ? "⮜" : "⮞"} {/* Ikony pro otevření a zavření */}
          </button>
        </div>

        <MapContainer
          className="map"
          center={position}
          zoom={13}
          scrollWheelZoom={true}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* GeoJSON data podle filtrů */}
          {showRadarData && RadarsData && (
            <GeoJSON data={RadarsData} pointToLayer={pointToLayerRadars} />
          )}
          {showOtherDataFilter && otherGeoJsonData && (
            <GeoJSON
              data={otherGeoJsonData}
              pointToLayer={pointToLayerOthers}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
