import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, GeoJSON, Polyline } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "../../app/globals.css";
import ButtonToggle from "../ButtonToggle";
import FilterSection from "../FilterSection";
import LegendSection from "../LegendSection";
import FooterSection from "../FooterSection";
import HeaderSection from "../HeaderSection";
import { fetchRadarsData, fetchAccidentsData } from "@/utils/fetchData";
import "leaflet-rotatedmarker";
import {
  radarIcon,
  carCrashIcon,
  carCrashPedestrianIcon,
  arrowIcon,
} from "@/utils/mapIcons";

const Map: React.FC = () => {
  const position: LatLngExpression = [50.503056, 13.636667];
  const [RadarsData, setRadarsData] = useState<any>(null);
  const [AccidentsData, setAccidentsData] = useState<any>(null);
  const [filteredAccidentsData, setFilteredAccidentsData] = useState<any>(null); // filtrovane nehody

  const [showFilters, setShowFilters] = useState(true);
  const [showLegend, setShowLegend] = useState(true);

  const [showRadarData, setShowRadarData] = useState(false);
  const [showAccidentData, setShowAccidentData] = useState(false);
  const [showTrafficData, setShowTrafficData] = useState(false);

  const [tileLayerUrl, setTileLayerUrl] = useState(
    "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  );

  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedDay, setSelectedDay] = useState<string>("all");
  const [realAngle, setRealAngle] = useState(false);

  //tomtom api
  const apiKey = process.env.NEXT_PUBLIC_TOMTOM_API_KEY;
  const tomTomTileUrl = `https://api.tomtom.com/traffic/map/4/tile/flow/relative0/{z}/{x}/{y}.png?key=${apiKey}`;

  useEffect(() => {
    const loadData = async () => {
      const radars = await fetchRadarsData();
      setRadarsData(radars);

      const accidents = await fetchAccidentsData();
      setAccidentsData(accidents);

      setLastUpdate(new Date().toLocaleString());
    };

    loadData();
  }, []);

  useEffect(() => {
    if (AccidentsData) {
      const filtered = {
        type: "FeatureCollection",
        features: AccidentsData.features.filter((feature: any) => {
          const datum = feature.properties?.datum;
          if (!datum) return false;
          const parts = datum.split("/");
          if (parts.length !== 3) return false;
          const den = parts[0];
          const mesic = parts[1];
          const rok = parts[2];

          return (
            rok === selectedYear &&
            (selectedMonth === "all" ||
              parseInt(mesic, 10) === parseInt(selectedMonth, 10)) &&
            (selectedDay === "all" ||
              parseInt(den, 10) === parseInt(selectedDay, 10))
          );
        }),
      };
      setFilteredAccidentsData(filtered);
    }

    if (showAccidentData) {
      setShowAccidentData(false);
      setTimeout(() => setShowAccidentData(true), 0);
    }
  }, [selectedYear, selectedMonth, selectedDay, AccidentsData]);

  useEffect(() => {
    if (showRadarData) {
      setShowRadarData(false);
      setTimeout(() => setShowRadarData(true), 0);
    }
  }, [realAngle]); // Když se změní realAngle, triggeruj překreslení radarů

  const pointToLayerRadars = (feature: any, latlng: LatLngExpression) => {
    const rotation = realAngle ? feature.properties.smer + 105 : 0; // cca směr si myslím, kamera směřuje doleva dolů originál
    const arrowRotation = feature.properties.smer - 90; // směr šipky - 90 protože originál směřuje doprava
    const marker = L.marker(latlng, {
      icon: radarIcon,
    } as L.MarkerOptions);

    (marker as any).setRotationAngle(rotation);
    marker.bindPopup(`
      <div style="display: flex; align-items: center; gap: 8px;">
        <b>směr:</b> ${feature.properties.smer}°
        <img src="${arrowIcon.options.iconUrl}" 
             style="width: 20px; height: 20px; transform: rotate(${arrowRotation}deg);" 
             alt="Radar směr"/>
      </div>
      <b>ulice:</b> ${feature.properties.lokalita}<br/>
      <b>v provozu:</b> ${feature.properties.v_provozu}<br/>
    `);

    return marker;
  };

  // zobrazeni nehod, pokud je v tom chodec, tak je červeně
  const pointToLayerAccidents = (feature: any, latlng: LatLngExpression) => {
    const pedestrians = feature.properties.chodci; // Pole chodců
    const consequences = feature.properties.nasledky_ve_vozidle; // Pole následků
    const hasPedestrianCategory = pedestrians.length > 0;

    let icon = carCrashIcon;

    if (hasPedestrianCategory) {
      icon = carCrashPedestrianIcon;
    }

    const marker = L.marker(latlng, {
      icon: icon,
    });

    // Zpracování chodců do HTML řetězce
    const pedestriansInfo =
      pedestrians.length > 0
        ? pedestrians
            .map(
              (p: any, index: number) =>
                `<b>Chodec ${index + 1}:</b> ${p.kategorie}, následky: ${
                  p.nasledky_chodci
                }, věk: ${p.vek}<br/>`
            )
            .join("")
        : "";

    // Zpracování následků do HTML řetězce
    const consequencesInfo =
      consequences.length > 0
        ? consequences
            .map(
              (c: any, index: number) =>
                `<b>Následek ${index + 1}:</b> ${c.nasledky_vozidlo}<br/>` // ve vozidle následky?
            )
            .join("")
        : "";

    marker.bindPopup(`
      <b>ID nehody:</b> ${feature.properties.id}<br/>
      <b>Alkohol u viníka:</b> ${feature.properties.alkohol}<br/>
      ${pedestriansInfo}
      ${consequencesInfo}
    `);

    return marker;
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
            showTrafficData={showTrafficData}
            setShowTrafficData={setShowTrafficData}
            isFiltersVisible={showFilters}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            onUpdateData={uploadData}
            //onUpdateData={handleUpdateData}
            realAngle={realAngle}
            setRealAngle={setRealAngle}
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
          <LegendSection
            isLegendVisible={showLegend}
            showTrafficData={showTrafficData}
          />
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
          <TileLayer attribution={""} url={tileLayerUrl} />
          {/* GeoJSON data */}
          {showRadarData && RadarsData && (
            <GeoJSON data={RadarsData} pointToLayer={pointToLayerRadars} />
          )}
          {showAccidentData && filteredAccidentsData && (
            <GeoJSON
              data={filteredAccidentsData}
              pointToLayer={pointToLayerAccidents}
            />
          )}
          {/* tu přidat layer na dopravní situaci či co. */}
          {showTrafficData && <TileLayer url={tomTomTileUrl} />}
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
