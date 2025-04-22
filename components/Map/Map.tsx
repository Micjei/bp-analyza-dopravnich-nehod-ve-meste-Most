// Základní knihovny
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Knihovny pro práci s React a Leaflet
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { LatLngExpression } from "leaflet";

// Utility a styly
import { useEffect, useState } from "react";
import "../../app/globals.css";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";

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

import { useTranslation } from "react-i18next";
import "@/i18n"; // Import konfigurace i18n

import { useData } from "@/context/DataContext";
import { useTheme } from "@/context/ThemeContext";
import { useMapLayer } from "@/context/MapLayerContext";

const Map: React.FC = () => {
  const position: LatLngExpression = [50.503056, 13.636667];
  const { RadarsData, AccidentsData } = useData();
  //const [RadarsData, setRadarsData] = useState<any>(null);
  //const [AccidentsData, setAccidentsData] = useState<any>(null);
  const [filteredAccidentsData, setFilteredAccidentsData] = useState<any>(null); // filtrovane nehody
  const [filteredRadarsData, setFilteredRadarsData] = useState<any>(null); // filtrovane radary

  const [showFilters, setShowFilters] = useState(false);
  const [showLegend, setShowLegend] = useState(false);

  const [showRadarData, setShowRadarData] = useState(false);
  const [showAccidentData, setShowAccidentData] = useState(false);
  const [showTrafficData, setShowTrafficData] = useState(false);

  const { isDark } = useTheme();
  const { tileLayerUrl, setTileLayerUrl } = useMapLayer();

  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [selectedMonth, setSelectedMonth] = useState<string>("-");
  const [selectedDay, setSelectedDay] = useState<string>("-");
  const [alcoholFilter, setAlcoholFilter] = useState<string>("-");
  const [drugsFilter, setDrugsFilter] = useState<string>("-");
  const [pedestrianFilter, setPedestrianFilter] = useState<string>("-");
  const [deadFilter, setDeadFilter] = useState<string>("-");

  //const [realAngle, setRealAngle] = useState(false);
  const [isRadarActive, setIsRadarActive] = useState<string>("-");

  //tomtom api
  const apiKey = process.env.NEXT_PUBLIC_TOMTOM_API_KEY;
  const tomTomTileUrl = `https://api.tomtom.com/traffic/map/4/tile/flow/relative0/{z}/{x}/{y}.png?key=${apiKey}`;

  const [showAccidentsHeatmap, setShowAccidentsHeatmap] = useState(false); // heatmap nehody
  const [showMeasureHeatmap, setShowMeasureHeatmap] = useState(false); // heatmap nehody
  const [numberOfRadars, setNumberOfRadars] = useState(0); // pocet radarů
  const [numberOfAccidents, setNumberOfAccidents] = useState(0); // pocet nehod

  const { t, i18n } = useTranslation();
  /*useEffect(() => {
    const loadData = async () => {
      const radars = await fetchRadarsData();
      setRadarsData(radars);

      const accidents = await fetchAccidentsData();
      setAccidentsData(accidents);
    };

    loadData();
  }, []);*/

  useEffect(() => {
    if (showAccidentData && AccidentsData) {
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
            (selectedMonth === "-" ||
              parseInt(mesic, 10) === parseInt(selectedMonth, 10)) &&
            (selectedDay === "-" ||
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
    AccidentsData,
  ]);

  useEffect(() => {
    if (RadarsData) {
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
    } else {
      setNumberOfRadars(0);
    }
  }, [, /*realAngle*/ isRadarActive, showRadarData, RadarsData]); // Když se změní realAngle, triggeruj překreslení radarů

  // upravit možná? je tam problik. Useefect pro změnu jazyka
  useEffect(() => {
    if (showRadarData) {
      setShowRadarData(false);

      setTimeout(() => {
        setShowRadarData(true);
      }, 0);
    }
    if (showAccidentData) {
      setShowAccidentData(false);

      setTimeout(() => {
        setShowAccidentData(true);
      }, 0);
    }
  }, [i18n.language]);

  const pointToLayerRadars = (feature: any, latlng: LatLngExpression) => {
    //const rotation = realAngle ? feature.properties.smer + 105 : 0; // cca směr si myslím, kamera směřuje doleva dolů originál
    const arrowRotation = feature.properties.smer - 90; // směr šipky - 90 protože originál směřuje doprava
    const measurements = feature.properties.mereni; // Pole mereni

    const marker = L.marker(latlng, {
      icon: radarIcon,
    } as L.MarkerOptions);

    //(marker as any).setRotationAngle(rotation);

    // upravit info
    const measurementsInfo =
      measurements.length > 0
        ? measurements
            .slice(0, 5) // Omezí počet zobrazených měření na 5
            .map(
              (m: any, index: number) =>
                `<b>${t("measurement")}: ${index + 1}:</b> 
            ${t("speed")}: ${m.prekroceni_rychlost_soucet} km/h, 
            ${t("date")}: ${m.datum}, 
            ${t("speeding")}: ${m.prekroceni_ve_smeru}<br/>`
            )
            .join("") + (measurements.length > 5 ? `<b>${t("more")}</b>` : "")
        : "";

    marker.bindPopup(`
      <b>ID:</b> ${feature.properties.id}<br/>
      <div style="display: flex; align-items: center; gap: 8px;">
        <b>${t("direction")}:</b> ${feature.properties.smer}°
        <img src="${arrowIcon.options.iconUrl}" 
             style="width: 20px; height: 20px; transform: rotate(${arrowRotation}deg);" 
             alt="Radar směr"/>
      </div>
      <b>${t("street")}:</b> ${feature.properties.lokalita}<br/>
      <b>${t("in_operation")}:</b> ${feature.properties.v_provozu}<br/>
      ${measurementsInfo}
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
                `<b>Chodec ${index + 1}:</b> ${getPedestrianDescription(t)(
                  // jazyk
                  p.kategorie
                )}, následky: ${getConsequenceDescription(t)(
                  // jazyk
                  p.nasledky_chodci
                )}, věk: ${p.vek}<br/>` // jazyk
            )
            .join("")
        : "";

    // Zpracování následků do HTML řetězce
    const consequencesInfo =
      consequences.length > 0
        ? consequences
            .map(
              (c: any, index: number) =>
                `<b>${t("consequence")} ${
                  index + 1
                }:</b> ${getConsequenceDescription(t)(c.nasledky_vozidlo)}<br/>` // ve vozidle následky?
            )
            .join("")
        : "";

    marker.bindPopup(`
      <b>ID:</b> ${feature.properties.id}<br/>
      <b>${t("alcohol")}:</b> ${getAlcoholDescription(t)(
      feature.properties.alkohol
    )}<br/>
      <b>${t("drugs")}:</b> ${getDrugsDescription(t)(
      feature.properties.drogy
    )}<br/>
      ${pedestriansInfo}
      ${consequencesInfo}
    `);

    return marker;
  };

  // upload data do Firestore
  /*const uploadData = async () => {
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
  };*/

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

  // heatmap
  const HeatmapLayer: React.FC<{
    showHeatmap: boolean;
    data: any;
    intensityType: "accidents" | "radars";
  }> = ({ showHeatmap, data, intensityType }) => {
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
            let intensity = 0;
            if (intensityType === "accidents") {
              intensity = properties.nasledky_ve_vozidle.length + 10; // váha podle následků edit
            } else {
              intensity = Math.log2(properties.mereni.length + 1); // edit?
            }

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
      <div className="map relative">
        {/* Sekce filtrů s možností skrytí/odkrytí */}
        <div className="absolute md:left-5 left-1 top-28 z-[1001]">
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
            //onUpdateData={uploadData}
            //onUpdateData={handleUpdateData}
            //realAngle={realAngle}
            //setRealAngle={setRealAngle}
            isRadarActive={isRadarActive}
            setIsRadarActive={setIsRadarActive}
            showAccidentsHeatmap={showAccidentsHeatmap}
            setShowAccidentsHeatmap={setShowAccidentsHeatmap}
            showMeasureHeatmap={showMeasureHeatmap}
            setShowMeasureHeatmap={setShowMeasureHeatmap}
            numberOfRadars={numberOfRadars}
            numberOfAccidents={numberOfAccidents}
          />
          {/* Tlačítko pro zobrazení a skrytí filtrů */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="absolute h-12 w-6 top-1/2 left-full -translate-y-1/2  bg-filters-bg text-filters-text border-2 border-filters-border border-l-0 rounded-r-[20%] cursor-pointer shadow-[0_2px_6px_rgba(0,0,0,0.2)] transition-all duration-300 opacity-80 z-[-1] flex items-center justify-center"
          >
            <motion.div
              initial={false}
              animate={{ rotate: showFilters ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronRight size={18} />
            </motion.div>
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
            className="absolute w-12 left-1/2 bottom-full -translate-x-1/2 bg-legend-bg text-legend-text border-2 border-legend-border border-b-0 rounded-t-[20%] cursor-pointer shadow-[0_2px_6px_rgba(0,0,0,0.2)] transition-all duration-300 opacity-80 flex items-center justify-center"
          >
            <motion.div
              initial={false}
              animate={{ rotate: showLegend ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronUp size={18} />
            </motion.div>
          </button>
        </div>

        {/* header 
        <div className="w-full absolute top-0 z-[1000]">
          <HeaderSection />
        </div>*/}

        {/* footer */}
        <div className="w-full absolute bottom-0 z-[1000]">
          <FooterSection />
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
          {showRadarData && filteredRadarsData && (
            <MarkerClusterGroup
              iconCreateFunction={(cluster: L.MarkerCluster) =>
                customClusterIcon(cluster, "gray")
              }
            >
              <GeoJSON
                key={`radars-${filteredRadarsData.features
                  .map((f: any) => f.id)
                  .join(",")}`}
                data={filteredRadarsData}
                pointToLayer={pointToLayerRadars}
              />
            </MarkerClusterGroup>
          )}

          {/** radary heatmap */}
          {showMeasureHeatmap && (
            <HeatmapLayer
              showHeatmap={showMeasureHeatmap}
              data={filteredRadarsData}
              intensityType="radars"
            />
          )}

          {/** nehody */}
          {!showAccidentsHeatmap &&
            showAccidentData &&
            filteredAccidentsData && (
              <MarkerClusterGroup
                iconCreateFunction={(cluster: L.MarkerCluster) =>
                  customClusterIcon(cluster, "black")
                }
              >
                <GeoJSON
                  key={`accidents-${filteredAccidentsData.features
                    .map((f: any) => f.id)
                    .join(",")}`}
                  data={filteredAccidentsData}
                  pointToLayer={pointToLayerAccidents}
                />
              </MarkerClusterGroup>
            )}
          {/** nehody heatmap */}
          {showAccidentData &&
            filteredAccidentsData &&
            showAccidentsHeatmap && (
              <HeatmapLayer
                showHeatmap={showAccidentsHeatmap}
                data={filteredAccidentsData}
                intensityType="accidents"
              />
            )}

          {/** dopravni situace */}
          {showTrafficData && <TileLayer url={tomTomTileUrl} />}
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
