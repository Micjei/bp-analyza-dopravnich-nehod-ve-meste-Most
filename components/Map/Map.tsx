import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "../../app/globals.css";
import ButtonToggle from "../ButtonToggle";
import FilterSection from "../FilterSection";
import LegendSection from "../LegendSection";
import FooterSection from "../FooterSection";
import HeaderSection from "../HeaderSection";

const Map: React.FC = () => {
  const position: LatLngExpression = [50.503056, 13.636667];
  const [RadarsData, setRadarsData] = useState<any>(null);
  const [otherGeoJsonData, setOtherGeoJsonData] = useState<any>(null);

  const [showFilters, setShowFilters] = useState(true);
  const [showLegend, setShowLegend] = useState(true);

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
    <div className="flex flex-col items-start w-full relative">
      {/* Kontejner pro mapu */}
      <div className="map">
        {/* Sekce filtrů s možností skrytí/odkrytí */}
        <div className="absolute top-[40%] left-5 z-[1000]">
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
            className="absolute h-12 w-6 top-1/2 left-full -translate-y-1/2 -translate-x-[0.100rem] bg-[#aac9ab] text-[#388E3C] border-2 border-[#66BB6A] rounded-r-[20%] cursor-pointer shadow-[0_2px_6px_rgba(0,0,0,0.2)] transition-all duration-300 opacity-80"
          >
            {showFilters ? "⮜" : "⮞"}
          </button>
        </div>

        <div className="absolute bottom-10 right-5 z-[1000]">
          <LegendSection isLegendVisible={showLegend} />
          {/* Tlačítko pro zobrazení a skrytí legendy */}
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="absolute w-12 left-1/2 bottom-full -translate-x-1/2 translate-y-[0.100rem] bg-[#aac9ab] text-[#388E3C] border-2 border-[#66BB6A] rounded-t-[20%] cursor-pointer shadow-[0_2px_6px_rgba(0,0,0,0.2)] transition-all duration-300 opacity-80"
          >
            {showLegend ? "⮛" : "⮙"}
          </button>
        </div>

        {/* footer */}
        <div className="w-full absolute bottom-0 z-[1000]">
          <FooterSection footerText="nějaky napis, aktualizace či co" />
        </div>

        {/* header */}
        <div className="w-full absolute top-0 z-[1000]">
          <HeaderSection headerText="header content" />
        </div>

        <MapContainer
          className="map"
          center={position}
          zoom={13}
          scrollWheelZoom={true}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            attribution={""}
            url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" // saletitní
            //url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // normalni
            //url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" // idk jaká
          />
          {/* GeoJSON data */}
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
