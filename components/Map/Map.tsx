// Základní knihovny
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Knihovny pro práci s React a Leaflet
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { LatLngExpression } from "leaflet";

// Utility a styly
import { useEffect, useState } from "react";
import "../../app/globals.css";

// Specifické komponenty
import ButtonToggle from "../ButtonToggle";
import FilterSection from "../FilterSection";
import LegendSection from "../LegendSection";
import FooterSection from "../FooterSection";
import HeaderSection from "../HeaderSection";

// Funkce pro získání dat
import { fetchRadarsData, fetchAccidentsData } from "@/utils/fetchData";

// Další doplňky pro mapu
import "leaflet-rotatedmarker";
import "leaflet.markercluster";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "leaflet.heat";

// Ikony pro mapu
import {
  radarIcon,
  carCrashIcon,
  carCrashPedestrianIcon,
  arrowIcon,
} from "@/utils/mapIcons";

// Popisné funkce pro popup okna
import {
  getAlcoholDescription,
  getDrugsDescription,
  getConsequenceDescription,
  getPedestrianDescription,
} from "@/utils/popupDescription";

const Map: React.FC = () => {
  const position: LatLngExpression = [50.503056, 13.636667];
  const [RadarsData, setRadarsData] = useState<any>(null);
  const [AccidentsData, setAccidentsData] = useState<any>(null);
  const [filteredAccidentsData, setFilteredAccidentsData] = useState<any>(null); // filtrovane nehody
  const [filteredRadarsData, setFilteredRadarsData] = useState<any>(null); // filtrovane radary

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
  const [alcoholFilter, setAlcoholFilter] = useState<string>("-");
  const [drugsFilter, setDrugsFilter] = useState<string>("-");
  const [pedestrianFilter, setPedestrianFilter] = useState<string>("-");
  const [deadFilter, setDeadFilter] = useState<string>("-");

  const [realAngle, setRealAngle] = useState(false);
  const [isRadarActive, setIsRadarActive] = useState<string>("-");

  //tomtom api
  const apiKey = process.env.NEXT_PUBLIC_TOMTOM_API_KEY;
  const tomTomTileUrl = `https://api.tomtom.com/traffic/map/4/tile/flow/relative0/{z}/{x}/{y}.png?key=${apiKey}`;

  const [showHeatmap, setShowHeatmap] = useState(false); // heatmap
  const [numberOfRadars, setNumberOfRadars] = useState(0); // pocet radarů
  const [numberOfAccidents, setNumberOfAccidents] = useState(0); // pocet nehod

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
    if (showAccidentData) {
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

          // alkohol filter
          const alkohol = feature.properties?.alkohol;
          // drugs filter
          const drogy = feature.properties?.drogy;
          // pedestrian filter
          const chodci = feature.properties?.chodci || [];
          // dead filter
          const smrt = feature.properties?.smrt;

          // TODO null hodnoty
          return (
            rok === selectedYear &&
            (selectedMonth === "all" ||
              parseInt(mesic, 10) === parseInt(selectedMonth, 10)) &&
            (selectedDay === "all" ||
              parseInt(den, 10) === parseInt(selectedDay, 10)) &&
            (alcoholFilter === "-" ||
              parseInt(alkohol, 10) === parseInt(alcoholFilter, 10)) &&
            (drugsFilter === "-" ||
              parseInt(drogy, 10) === parseInt(drugsFilter, 10)) &&
            (pedestrianFilter === "-" ||
              (pedestrianFilter === "ano" && chodci.length > 0) ||
              (pedestrianFilter === "ne" && chodci.length === 0)) &&
            (deadFilter === "-" ||
              parseInt(smrt, 10) === parseInt(deadFilter, 10) ||
              (deadFilter === "0" && parseInt(smrt, 10) !== 1))
          );
        }),
      };
      setNumberOfAccidents(filtered.features.length);
      setFilteredAccidentsData(filtered);
    } else {
      setNumberOfAccidents(0);
    }

    if (showAccidentData) {
      setShowAccidentData(false);
      setTimeout(() => setShowAccidentData(true), 0);
    }
  }, [
    selectedYear,
    selectedMonth,
    selectedDay,
    alcoholFilter,
    drugsFilter,
    pedestrianFilter,
    deadFilter,
    showAccidentData,
  ]);

  useEffect(() => {
    if (showRadarData) {
      const filtered = {
        type: "FeatureCollection",
        features: RadarsData.features.filter((feature: any) => {
          // v provozu
          const aktivita = feature.properties?.v_provozu;
          // TODO null hodnoty
          return isRadarActive === "-" || isRadarActive === aktivita;
        }),
      };
      setNumberOfRadars(filtered.features.length);
      setFilteredRadarsData(filtered);
    } else {
      setNumberOfRadars(0);
    }
    if (showRadarData) {
      setShowRadarData(false);
      setTimeout(() => setShowRadarData(true), 0);
    }
  }, [realAngle, isRadarActive, showRadarData]); // Když se změní realAngle, triggeruj překreslení radarů

  const pointToLayerRadars = (feature: any, latlng: LatLngExpression) => {
    const rotation = realAngle ? feature.properties.smer + 105 : 0; // cca směr si myslím, kamera směřuje doleva dolů originál
    const arrowRotation = feature.properties.smer - 90; // směr šipky - 90 protože originál směřuje doprava
    const marker = L.marker(latlng, {
      icon: radarIcon,
    } as L.MarkerOptions);

    (marker as any).setRotationAngle(rotation);

    marker.bindPopup(`
      <b>ID:</b> ${feature.properties.id}<br/>
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

  // zobrazeni nehod
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
                `<b>Chodec ${index + 1}:</b> ${getPedestrianDescription(
                  p.kategorie
                )}, následky: ${getConsequenceDescription(
                  p.nasledky_chodci
                )}, věk: ${p.vek}<br/>`
            )
            .join("")
        : "";

    // Zpracování následků do HTML řetězce
    const consequencesInfo =
      consequences.length > 0
        ? consequences
            .map(
              (c: any, index: number) =>
                `<b>Následek ${index + 1}:</b> ${getConsequenceDescription(
                  c.nasledky_vozidlo
                )}<br/>` // ve vozidle následky?
            )
            .join("")
        : "";

    marker.bindPopup(`
      <b>ID nehody:</b> ${feature.properties.id}<br/>
      <b>Alkohol u viníka:</b> ${getAlcoholDescription(
        feature.properties.alkohol
      )}<br/>
      <b>Drogy u viníka:</b> ${getDrugsDescription(
        feature.properties.drogy
      )}<br/>
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
        {
          name: "mereni",
          file: "mereni.geojson",
          api: "/api/uploadMeasurements",
        },
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

  // cluster
  const customClusterIcon = (cluster: L.MarkerCluster, color: string) => {
    const markers = cluster.getAllChildMarkers();
    const size = markers.length;

    return L.divIcon({
      html: `<div style="color: ${color}; border: 2px solid ${color}; background-color: white;"
                 class="p-2 rounded-full w-10 h-10 flex justify-center items-center text-xl">
                ${size}
              </div>`,
      className: "custom-cluster-icon",
      iconSize: L.point(40, 40),
    });
  };

  //heatmap
  const HeatmapLayer: React.FC<{ showHeatmap: boolean; data: any }> = ({
    showHeatmap,
    data,
  }) => {
    const map = useMap();

    useEffect(() => {
      if (!map || !showHeatmap || !data) return;

      const heatmapLayer = L.heatLayer(
        data.features
          .map((feature: any) => {
            const { geometry, properties } = feature;
            if (!geometry || !geometry.coordinates) return null;

            const lat = geometry.coordinates[1];
            const lng = geometry.coordinates[0];
            const intensity = properties.nasledky_ve_vozidle.length + 1; // váha podle následků

            return [lat, lng, intensity];
          })
          .filter(Boolean),
        {
          radius: 20,
          blur: 15,
          maxZoom: 17,
        }
      );

      heatmapLayer.addTo(map);

      return () => {
        map.removeLayer(heatmapLayer);
      };
    }, [map, showHeatmap, data]);

    return null;
  };

  return (
    <div className="flex flex-col items-start w-full relative">
      {/* Kontejner pro mapu */}
      <div className="map">
        {/* Sekce filtrů s možností skrytí/odkrytí */}
        <div className="absolute top-1/2 left-5 z-[1000] -translate-y-1/2">
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
            alcoholFilter={alcoholFilter}
            setAlcoholFilter={setAlcoholFilter}
            drugsFilter={drugsFilter}
            setDrugsFilter={setDrugsFilter}
            pedestrianFilter={pedestrianFilter}
            setPedestrianFilter={setPedestrianFilter}
            deadFilter={deadFilter}
            setDeadFilter={setDeadFilter}
            onUpdateData={uploadData}
            //onUpdateData={handleUpdateData}
            realAngle={realAngle}
            setRealAngle={setRealAngle}
            isRadarActive={isRadarActive}
            setIsRadarActive={setIsRadarActive}
            showHeatmap={showHeatmap}
            setShowHeatmap={setShowHeatmap}
            numberOfRadars={numberOfRadars}
            numberOfAccidents={numberOfAccidents}
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
            showAccidentData={showAccidentData}
            showRadarData={showRadarData}
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

          {/* radary */}
          {showRadarData && showRadarData && filteredRadarsData && (
            <MarkerClusterGroup
              iconCreateFunction={(cluster: L.MarkerCluster) =>
                customClusterIcon(cluster, "red")
              }
            >
              <GeoJSON
                data={filteredRadarsData}
                pointToLayer={pointToLayerRadars}
              />
            </MarkerClusterGroup>
          )}

          {showHeatmap && (
            <HeatmapLayer
              showHeatmap={showHeatmap}
              data={filteredAccidentsData}
            />
          )}

          {/** nehody */}
          {!showHeatmap && showAccidentData && filteredAccidentsData && (
            <MarkerClusterGroup
              iconCreateFunction={(cluster: L.MarkerCluster) =>
                customClusterIcon(cluster, "black")
              }
            >
              <GeoJSON
                data={filteredAccidentsData}
                pointToLayer={pointToLayerAccidents}
              />
            </MarkerClusterGroup>
          )}

          {/** dopravni situace */}
          {showTrafficData && <TileLayer url={tomTomTileUrl} />}
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
