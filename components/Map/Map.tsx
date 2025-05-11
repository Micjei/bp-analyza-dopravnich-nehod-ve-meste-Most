// Core Leaflet imports (map engine + default styles)
import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

// React & React Leaflet map components
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";

// React hooks and animation utilities
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Global styles
import "../../app/globals.css";

// Icons from lucide-react (for toggle buttons)
import { ChevronRight, ChevronUp } from "lucide-react";

// Map enhancements (heatmaps, marker rotation, clustering)
import "leaflet-rotatedmarker";
import "leaflet.markercluster";
import "leaflet.heat";
import MarkerClusterGroup from "react-leaflet-markercluster";

// Reusable UI sections for the map interface
import FilterSection from "../FilterSection";
import LegendSection from "../LegendSection";
import FooterSection from "../FooterSection";

// Custom icons for different marker types
import {
  radarIcon,
  carCrashIcon,
  carCrashPedestrianIcon,
  arrowIcon,
} from "@/utils/mapIcons";

// Description utilities for popup content (localized descriptions)
import {
  getActivityDescription,
  getAlcoholDescription,
  getDrugsDescription,
  getConsequenceDescription,
  getPedestrianDescription,
  getFaultDescription,
  getCauseDescription,
  getDamageDescription,
  getVehicleTypeDescription,
  getVehicleDirectionDescription,
} from "@/utils/popupDescription";

// i18n localization (translations)
import { useTranslation } from "react-i18next";
import "@/i18n";

// Contexts for global state (data and map layer configuration)
import { useData } from "@/context/DataContext";
import { useMapLayer } from "@/context/MapLayerContext";

const Map: React.FC = () => {
  // Default map center coordinates (Most city)
  const position: LatLngExpression = [50.503056, 13.636667];

  // Access to global data context (accidents and radars)
  const { RadarsData, AccidentsData } = useData();

  // State for storing filtered datasets (after applying filters)
  const [filteredAccidentsData, setFilteredAccidentsData] = useState<any>(null);
  const [filteredRadarsData, setFilteredRadarsData] = useState<any>(null);

  // UI toggles for showing/hiding sections
  const [showFilters, setShowFilters] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [showRadarData, setShowRadarData] = useState(false);
  const [showAccidentData, setShowAccidentData] = useState(false);
  const [showTrafficData, setShowTrafficData] = useState(false);

  // Map tile layer (light/dark theme switching)
  const { tileLayerUrl, setTileLayerUrl } = useMapLayer();

  // Filter states
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [selectedMonth, setSelectedMonth] = useState<string>("-");
  const [selectedDay, setSelectedDay] = useState<string>("-");
  const [alcoholFilter, setAlcoholFilter] = useState<string>("-");
  const [drugsFilter, setDrugsFilter] = useState<string>("-");
  const [pedestrianFilter, setPedestrianFilter] = useState<string>("-");
  const [deadFilter, setDeadFilter] = useState<string>("-");

  // Radar activity filter (e.g. only active radars)
  const [isRadarActive, setIsRadarActive] = useState<string>("-");

  // Tile layer URL for live traffic from TomTom (optional overlay)
  const apiKey = process.env.NEXT_PUBLIC_TOMTOM_API_KEY;
  const tomTomTileUrl = `https://api.tomtom.com/traffic/map/4/tile/flow/relative0/{z}/{x}/{y}.png?key=${apiKey}`;

  // Heatmap toggles
  const [showAccidentsHeatmap, setShowAccidentsHeatmap] = useState(false);
  const [showMeasureHeatmap, setShowMeasureHeatmap] = useState(false);

  // Counters for visual display (e.g. total accidents or radars after filters)
  const [numberOfRadars, setNumberOfRadars] = useState(0);
  const [numberOfAccidents, setNumberOfAccidents] = useState(0);

  // Translation function and current language
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // If accident data should be shown and data is available
    if (showAccidentData && AccidentsData) {
      // Filter the accident data based on selected filters
      const filtered = {
        type: "FeatureCollection",
        features: AccidentsData.features.filter((feature: any) => {
          const datum = feature.properties?.datum;
          if (!datum) return false;

          // Parse the date into day/month/year
          const parts = datum.split("/");
          if (parts.length !== 3) return false;
          const den = parts[0];
          const mesic = parts[1];
          const rok = parts[2];

          // Extract values for filtering
          const alkohol = feature.properties?.alkohol;
          const drogy = feature.properties?.drogy;
          const chodci = feature.properties?.chodci || []; // array of pedestrians
          const smrt = feature.properties?.smrt;

          const alkoholStr = String(parseInt(alkohol, 10));
          const drogyStr = String(parseInt(drogy, 10));

          // Define which values indicate "yes" for alcohol and drugs
          const alcoholYesValues = ["1", "3", "4", "5", "6", "7", "8", "9"]; // 0 = unknown
          const drugsYesValues = ["1", "2", "3", "4", "5", "6", "7"]; // 0 = no

          // Apply all filters: date, alcohol, drugs, pedestrians, deaths
          return (
            (selectedYear === "-" ||
              parseInt(rok) === parseInt(selectedYear)) &&
            (selectedMonth === "-" ||
              parseInt(mesic, 10) === parseInt(selectedMonth, 10)) &&
            (selectedDay === "-" ||
              parseInt(den, 10) === parseInt(selectedDay, 10)) &&
            (alcoholFilter === "-" ||
              (alcoholFilter === "ano" &&
                alcoholYesValues.includes(alkoholStr)) ||
              alkoholStr === alcoholFilter) &&
            (drugsFilter === "-" ||
              (drugsFilter === "ano" && drugsYesValues.includes(drogyStr)) ||
              drogyStr === drugsFilter) &&
            (pedestrianFilter === "-" ||
              (pedestrianFilter === "1" && chodci.length > 0) ||
              (pedestrianFilter === "0" && chodci.length === 0)) &&
            (deadFilter === "-" ||
              parseInt(smrt, 10) === parseInt(deadFilter, 10) ||
              (deadFilter === "0" && parseInt(smrt, 10) !== 1))
          );
        }),
      };

      // Save filtered accident data and number of results
      setNumberOfAccidents(filtered.features.length);
      setFilteredAccidentsData(filtered);
    } else {
      // If no data should be shown, reset counters
      setNumberOfAccidents(0);
    }

    // Force rerendering the accident layer by toggling state
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
    // If radar data is available
    if (RadarsData) {
      // Filter radar features based on whether the radar is active or not
      const filtered = {
        type: "FeatureCollection",
        features: RadarsData.features.filter((feature: any) => {
          const aktivita = feature.properties?.v_provozu;
          return isRadarActive === "-" || isRadarActive === aktivita;
        }),
      };

      // Save the number of filtered radars and the filtered dataset
      setNumberOfRadars(filtered.features.length);
      setFilteredRadarsData(filtered);
    } else {
      // No data available – reset radar count
      setNumberOfRadars(0);
    }

    // Force re-render of radar layer by toggling the visibility state
    if (showRadarData) {
      setShowRadarData(false);
      setTimeout(() => setShowRadarData(true), 0);
    } else {
      setNumberOfRadars(0); // Also reset if radar data is not shown
    }
  }, [isRadarActive, showRadarData, RadarsData]);

  // Format date string from "yyyymmdd" to "dd/mm/yyyy"
  const formateDate = (datumText: string) => {
    const year = datumText?.slice(0, 4);
    const month = datumText?.slice(4, 6);
    const day = datumText?.slice(6, 8);

    const formated_date = day + "/" + month + "/" + year;
    console.log(datumText); // Optional: for debugging
    return formated_date;
  };

  // Render a radar marker with popup info
  const pointToLayerRadars = (feature: any, latlng: LatLngExpression) => {
    const arrowRotation = feature.properties.smer - 90; // Adjust direction arrow (-90°)
    const measurements = feature.properties.mereni; // Array of speed measurements

    // Create radar marker with radar icon
    const marker = L.marker(latlng, {
      icon: radarIcon,
    } as L.MarkerOptions);

    // Prepare HTML string for popup with up to 2 measurements
    const measurementsInfo =
      measurements.length > 0
        ? measurements
            .slice(0, 2) // Show only first 2 measurements
            .map(
              (m: any, index: number) =>
                `<b>${t("measurement")}: ${index + 1}:</b> 
                ${t("speeding")}: ${m.prekroceni_rychl_soucet},
                ${t("date")}: ${formateDate(m.datum_text)}, 
                ${t("speeding_in_line")}: ${m.prekroceni_rychl_ve_smeru},
                ${t("speeding_out_line")}: ${
                  m.prekroceni_rychl_v_protismeru
                }, <br/>`
            )
            .join("") + (measurements.length > 5 ? `<b>${t("more")}</b>` : "")
        : "";

    // Bind popup to marker with direction arrow and measurement info
    marker.bindPopup(`
      <div style="display: flex; align-items: center; gap: 8px;">
        <b>${t("direction")}:</b>
        <img src="${arrowIcon.options.iconUrl}" 
             style="width: 20px; height: 20px; transform: rotate(${arrowRotation}deg);" 
             alt="Radar direction"/>
      </div>
      <b>${t("street")}:</b> ${feature.properties.lokalita}<br/>
      <b>${t("in_operation")}:</b> ${getActivityDescription(t)(
      feature.properties.v_provozu
    )}<br/>
      ${measurementsInfo}
    `);

    return marker;
  };

  // Rendering accident markers on the map
  const pointToLayerAccidents = (feature: any, latlng: LatLngExpression) => {
    const pedestrians = feature.properties.chodci; // Pedestrians involved
    const consequences = feature.properties.nasledky_ve_vozidle; // Consequences for passengers in vehicles
    const vehicles = feature.properties.vozidla; // Vehicles involved
    const hasPedestrianCategory = pedestrians.length > 0;

    // Use special icon if pedestrians are involved
    let icon = carCrashIcon;
    if (hasPedestrianCategory) {
      icon = carCrashPedestrianIcon;
    }

    // Create marker with the appropriate icon
    const marker = L.marker(latlng, {
      icon: icon,
    });

    // Format pedestrian data into popup content
    const pedestriansInfo =
      pedestrians.length > 0
        ? pedestrians
            .map(
              (p: any, index: number) =>
                `<b>${t("pedestrian")} ${
                  index + 1
                }:</b> ${getPedestrianDescription(t)(p.kategorie)}, 
              ${t("consequence")}: ${getConsequenceDescription(t)(
                  p.nasledky_chodci
                )}, 
              ${t("age")}: ${p.vek}<br/>`
            )
            .join("")
        : "";

    // Format passenger consequences into popup content
    const consequencesInfo =
      consequences.length > 0
        ? consequences
            .map(
              (c: any, index: number) =>
                `<b>${t("passenger")} ${
                  index + 1
                }:</b> ${getConsequenceDescription(t)(c.nasledky_vozidlo)}<br/>`
            )
            .join("")
        : "";

    // Format vehicle information into popup content
    const vehiclesInfo =
      vehicles.length > 0
        ? vehicles
            .map(
              (v: any, index: number) =>
                `<b>${t("vehicle")} ${
                  index + 1
                }:</b> ${getVehicleTypeDescription(t)(v.vozidlo)}, 
              ${t("vehicle_position")}: ${getVehicleDirectionDescription(t)(
                  v.postaveni_vozidla
                )}<br/>`
            )
            .join("")
        : "";

    // Bind full popup content to marker
    marker.bindPopup(`
    <b>${t("date")}:</b> ${feature.properties.datum}<br/>
    <b>${t("alcohol")}:</b> ${getAlcoholDescription(t)(
      feature.properties.alkohol
    )}<br/>
    <b>${t("drugs")}:</b> ${getDrugsDescription(t)(
      feature.properties.drogy
    )}<br/>
    ${pedestriansInfo}
    ${consequencesInfo}
    ${vehiclesInfo}
    <b>${t("fault_of_accident")}:</b> ${getFaultDescription(t)(
      feature.properties.zavineni_nehody
    )}<br/> 
    <b>${t("cause_of_accident")}:</b> ${getCauseDescription(t)(
      feature.properties.priciny_nehody
    )}<br/> 
    <b>${t("material_damage")}:</b> ${getDamageDescription(t)(
      feature.properties.skoda
    )}<br/> 
  `);

    return marker;
  };

  // Custom icon for marker clusters
  const customClusterIcon = (cluster: L.MarkerCluster, color: string) => {
    const markers = cluster.getAllChildMarkers(); // Get all child markers in this cluster
    const size = markers.length; // Number of markers in the cluster

    return L.divIcon({
      html: `<div style="color: ${color}; border: 2px solid ${color}; background-color: white;"
               class="p-2 rounded-full w-10 h-10 flex justify-center items-center text-xl">
              ${size}
            </div>`,
      className: "custom-cluster-icon",
      iconSize: L.point(40, 40),
    });
  };

  // Heatmap layer component – can visualize accident or radar data
  const HeatmapLayer: React.FC<{
    showHeatmap: boolean;
    data: any;
    intensityType: "accidents" | "radars";
  }> = ({ showHeatmap, data, intensityType }) => {
    const map = useMap();

    useEffect(() => {
      if (!map || !showHeatmap || !data) return;

      // Create heatmap layer using coordinates and calculated intensity
      const heatmapLayer = L.heatLayer(
        data.features
          .map((feature: any) => {
            const { geometry, properties } = feature;
            if (!geometry || !geometry.coordinates) return null;

            const lat = geometry.coordinates[1];
            const lng = geometry.coordinates[0];

            // Set intensity depending on data type
            let intensity = 0;
            if (intensityType === "accidents") {
              intensity = properties.nasledky_ve_vozidle.length + 10; // Weight by number of consequences
            } else {
              intensity = Math.log2(properties.mereni.length + 1); // Weight by number of radar measurements
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
        // Cleanup: remove heatmap when component unmounts or updates
        map.removeLayer(heatmapLayer);
      };
    }, [map, showHeatmap, data]);

    return null;
  };

  return (
    // Main container for the entire map section
    <div className="flex flex-col items-start w-full relative">
      {/* Container holding the map and overlay components */}
      <div className="map relative">
        {/* Filter section positioned in top-left corner */}
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
            isRadarActive={isRadarActive}
            setIsRadarActive={setIsRadarActive}
            showAccidentsHeatmap={showAccidentsHeatmap}
            setShowAccidentsHeatmap={setShowAccidentsHeatmap}
            showMeasureHeatmap={showMeasureHeatmap}
            setShowMeasureHeatmap={setShowMeasureHeatmap}
            numberOfRadars={numberOfRadars}
            numberOfAccidents={numberOfAccidents}
          />

          {/* Toggle button for showing/hiding the filter panel */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="absolute h-12 w-6 top-1/2 left-full -translate-y-1/2  bg-filters-bg text-filters-text border-2 border-filters-border border-l-0 rounded-r-[20%] cursor-pointer shadow-[0_2px_6px_rgba(0,0,0,0.2)] transition-all duration-300 opacity-80 z-[-1] flex items-center justify-center"
          >
            <motion.div
              initial={false}
              animate={{ rotate: showFilters ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronRight size={18} className="text-red-500" />
            </motion.div>
          </button>
        </div>

        {/* Legend section in bottom-right corner */}
        <div className="absolute bottom-10 right-5 z-[1000]">
          <LegendSection
            isLegendVisible={showLegend}
            showTrafficData={showTrafficData}
            showAccidentData={showAccidentData}
            showRadarData={showRadarData}
          />

          {/* Toggle button for showing/hiding the legend */}
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="absolute w-12 left-1/2 bottom-full -translate-x-1/2 bg-legend-bg text-legend-text border-2 border-legend-border border-b-0 rounded-t-[20%] cursor-pointer shadow-[0_2px_6px_rgba(0,0,0,0.2)] transition-all duration-300 opacity-80 flex items-center justify-center"
          >
            <motion.div
              initial={false}
              animate={{ rotate: showLegend ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronUp size={18} className="text-red-500" />
            </motion.div>
          </button>
        </div>

        {/* Footer displayed at the bottom of the screen */}
        <div className="w-full absolute bottom-0 z-[1000]">
          <FooterSection />
        </div>

        {/* Main interactive map using Leaflet */}
        <MapContainer
          className="map"
          center={position}
          zoom={13}
          scrollWheelZoom={true}
          style={{ width: "100%", height: "100%" }}
        >
          {/* Default map tiles (e.g. OSM or dark/light theme) */}
          <TileLayer attribution={""} url={tileLayerUrl} />

          {/* Radar markers with clustering */}
          {showRadarData && filteredRadarsData && (
            <MarkerClusterGroup
              iconCreateFunction={(cluster: L.MarkerCluster) =>
                customClusterIcon(cluster, "gray")
              }
            >
              <GeoJSON
                key={`radars-${i18n.language}-${filteredRadarsData.features
                  .map((f: any) => f.id)
                  .join(",")}`}
                data={filteredRadarsData}
                pointToLayer={pointToLayerRadars}
              />
            </MarkerClusterGroup>
          )}

          {/* Radar heatmap layer */}
          {showMeasureHeatmap &&
            showRadarData && ( // !
              <HeatmapLayer
                showHeatmap={showMeasureHeatmap}
                data={filteredRadarsData}
                intensityType="radars"
              />
            )}

          {/* Accident markers with clustering */}
          {!showAccidentsHeatmap &&
            showAccidentData &&
            filteredAccidentsData && (
              <MarkerClusterGroup
                iconCreateFunction={(cluster: L.MarkerCluster) =>
                  customClusterIcon(cluster, "black")
                }
              >
                <GeoJSON
                  key={`accidents-${
                    i18n.language
                  }-${filteredAccidentsData.features
                    .map((f: any) => f.id)
                    .join(",")}`}
                  data={filteredAccidentsData}
                  pointToLayer={pointToLayerAccidents}
                />
              </MarkerClusterGroup>
            )}

          {/* Accident heatmap layer */}
          {showAccidentData &&
            filteredAccidentsData &&
            showAccidentsHeatmap && (
              <HeatmapLayer
                showHeatmap={showAccidentsHeatmap}
                data={filteredAccidentsData}
                intensityType="accidents"
              />
            )}

          {/* Traffic data overlay from TomTom */}
          {showTrafficData && <TileLayer url={tomTomTileUrl} />}
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
