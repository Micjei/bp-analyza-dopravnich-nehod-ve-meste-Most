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
import {
  fetchRadarsData,
  fetchAccidentsData,
  fetchOtherGeoJsonData,
} from "../../utils/fetchData";

const Map: React.FC = () => {
  const position: LatLngExpression = [50.503056, 13.636667];
  const [RadarsData, setRadarsData] = useState<any>(null);
  const [AccidentsData, setAccidentsData] = useState<any>(null);
  const [otherGeoJsonData, setOtherGeoJsonData] = useState<any>(null); // smazat

  const [showFilters, setShowFilters] = useState(true);
  const [showLegend, setShowLegend] = useState(true);

  const [showRadarData, setShowRadarData] = useState(false);
  const [showAccidentData, setShowAccidentData] = useState(false);
  const [showOtherDataFilter, setShowOtherDataFilter] = useState(false); // smazat

  const [tileLayerUrl, setTileLayerUrl] = useState(
    "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  );

  const [lastUpdate, setLastUpdate] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      const radars = await fetchRadarsData();
      setRadarsData(radars);

      const accidents = await fetchAccidentsData();
      setAccidentsData(accidents);

      const otherData = await fetchOtherGeoJsonData(); // smazat
      setOtherGeoJsonData(otherData); // smazat

      setLastUpdate(new Date().toLocaleString());
    };

    loadData();

    setLastUpdate(new Date().toLocaleString());
  }, []);

  const pointToLayerRadars = (feature: any, latlng: LatLngExpression) => {
    const marker = L.circleMarker(latlng, {
      radius: 8,
      fillColor: "red",
      color: "white",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.7,
    });

    marker.bindPopup(`
      <b>směr:</b> ${feature.properties.smer}°<br/>
      <b>ulice:</b> ${feature.properties.lokalita}<br/>
      <b>v provozu:</b> ${feature.properties.v_provozu}<br/>
    `);

    return marker;
  };

  // zobrazeni nehod, pokud je v tom chodec, tak je červeně
  const pointToLayerAccidents = (feature: any, latlng: LatLngExpression) => {
    const hasPedestrianCategory =
      feature.properties.kategorie_chodce &&
      feature.properties.kategorie_chodce !== "neznámé";

    let fillColor = "blue"; // Výchozí barva

    if (hasPedestrianCategory) {
      fillColor = "red"; // Chodec i následek
    }

    const marker = L.circleMarker(latlng, {
      radius: 8,
      fillColor: fillColor,
      color: "white",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.7,
    });

    marker.bindPopup(`
      <b>id nehody:</b> ${feature.properties.id}<br/>
      <b>alkohol u viníka:</b> ${feature.properties.alkohol}<br/>
      <b>kategorie chodce:</b> ${feature.properties.kategorie_chodce}<br/>
      <b>nasledky na chodci:</b> ${feature.properties.nasledky_chodci}<br/>
      <b>nasledky ve vozidle:</b> ${feature.properties.nasledky_ve_vozidle}<br/>
    `);

    return marker;
  };

  // smazat
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

  // upload data do Firestore
  const uploadData = async () => {
    try {
      const datasets = [
        { name: "radary", file: "radary.geojson", api: "/api/uploadRadars" },
        { name: "nehody", file: "nehody.geojson", api: "/api/uploadAccidents" },
        {
          name: "vozidla",
          file: "vozidla.geojson",
          api: "/api/uploadVehicles",
        },
        {
          name: "nasledky",
          file: "nasledky.geojson",
          api: "/api/uploadConsequences",
        },
        {
          name: "chodci",
          file: "chodci.geojson",
          api: "/api/uploadPedestrians",
        },
      ];

      // Načíst soubory
      const fetchData = datasets.map(async (dataset) => {
        const response = await fetch(`/data/${dataset.file}`);
        const geojson = await response.json();
        return { ...dataset, geojson };
      });

      const loadedData = await Promise.all(fetchData);

      // Odeslat data
      const uploadRequests = loadedData.map(async ({ name, api, geojson }) => {
        const res = await fetch(api, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(geojson),
        });

        const result = await res.json();
        console.log(`${name} data:`, result);
      });

      await Promise.all(uploadRequests);
      console.log("✅ Všechna data byla úspěšně nahrána!");
    } catch (error) {
      console.error("❌ Chyba při nahrávání dat:", error);
    }
  };

  const handleUpdateData = () => {
    // TODO logika pro stažení a uložení nových dat

    setLastUpdate(new Date().toLocaleString());
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
            showAccidentData={showAccidentData}
            setShowAccidentData={setShowAccidentData}
            showOtherData={showOtherDataFilter}
            setShowOtherData={setShowOtherDataFilter}
            isFiltersVisible={showFilters}
            onUpdateData={uploadData}
            //onUpdateData={handleUpdateData}
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

        {/* header */}
        <div className="w-full absolute top-0 z-[1000]">
          <HeaderSection
            headerText="Interaktivní Dopravní Mapa"
            onLayerChange={setTileLayerUrl}
          />
        </div>

        {/* footer */}
        <div className="w-full absolute bottom-0 z-[1000]">
          <FooterSection
            footerText="Čas poslední aktualizace:"
            lastUpdate={lastUpdate}
          />
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
            url={tileLayerUrl}
            //url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" // saletitní
            //url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // normalni
            //url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" // idk jaká
          />
          {/* GeoJSON data */}
          {showRadarData && RadarsData && (
            <GeoJSON data={RadarsData} pointToLayer={pointToLayerRadars} />
          )}
          {showAccidentData && AccidentsData && (
            <GeoJSON
              data={AccidentsData}
              pointToLayer={pointToLayerAccidents}
            />
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
