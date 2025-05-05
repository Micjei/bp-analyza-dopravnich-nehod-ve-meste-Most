"use client";

import "../../app/globals.css";
import React, { useEffect, useState } from "react";
import FooterSection from "@/components/FooterSection";

// Import necessary modules from Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  RadarController,
  ArcElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  LogarithmicScale,
} from "chart.js";

// Register Chart.js components globally
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  RadarController,
  ArcElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  LogarithmicScale
);

// Import application data and components
import { useData } from "@/context/DataContext";
import RadarChartSection from "@/components/RadarChartSection";
import AccidentChartSection from "@/components/AccidentChartSection";
import { useTranslation } from "react-i18next";
import "@/i18n";

export default function StatsPage() {
  const { t } = useTranslation(); // For translations

  const { RadarsData, AccidentsData } = useData(); // Load radar and accident data from context

  // State for first radar chart
  const [selectedRadarYear, setSelectedRadarYear] = useState("2022");
  const [selectedRadarMonth, setSelectedRadarMonth] = useState("-");

  // State for second radar chart (if enabled)
  const [selectedRadarYear2, setSelectedRadarYear2] = useState("2022");
  const [selectedRadarMonth2, setSelectedRadarMonth2] = useState("-");
  const [showSecondRadarsStats, setShowSecondRadarsStats] = useState(false);

  // State for filtered accident data (first and second dataset)
  const [filteredAccidentsData, setFilteredAccidentsData] = useState<any>(null);
  const [filteredAccidentsData2, setFilteredAccidentsData2] =
    useState<any>(null);

  // State for accident filter (first chart)
  const [selectedAccidentYear, setSelectedAccidentYear] = useState("-");
  const [selectedAccidentMonth, setSelectedAccidentMonth] = useState("-");

  // State for accident filter (second chart)
  const [selectedAccidentYear2, setSelectedAccidentYear2] = useState("-");
  const [selectedAccidentMonth2, setSelectedAccidentMonth2] = useState("-");
  const [showSecondAccidentsStats, setShowSecondAccidentsStats] =
    useState(false);

  // List of months used for dropdown selection
  const months = [
    "-",
    ...Array.from({ length: 12 }, (_, i) => (i + 1).toString()),
  ];

  // Radar chart display modes
  type RadarChartMode = "summary" | "intervals" | "ratio";
  const [radarChartMode, setRadarChartMode] =
    useState<RadarChartMode>("summary");
  const [radarChartMode2, setRadarChartMode2] =
    useState<RadarChartMode>("summary");

  // Client-side rendering state (required for compatibility)
  const [isClient, setIsClient] = useState(false);

  // Only enable rendering on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Filter first accident dataset based on year and month
  useEffect(() => {
    if (AccidentsData) {
      const filtered = AccidentsData.features.filter((feature: any) => {
        const datum = feature.properties?.datum;
        const parts = datum.split("/");
        if (parts.length !== 3) return false;
        const mesic = parts[1]; // month
        const rok = parts[2]; // year
        return (
          (selectedAccidentYear === "-" ||
            parseInt(rok) === parseInt(selectedAccidentYear)) &&
          (selectedAccidentMonth === "-" ||
            parseInt(mesic, 10) === parseInt(selectedAccidentMonth, 10))
        );
      });

      setFilteredAccidentsData({ features: filtered });
    }
  }, [selectedAccidentYear, selectedAccidentMonth, AccidentsData]);

  // Filter second accident dataset (if comparison chart is shown)
  useEffect(() => {
    if (AccidentsData) {
      const filtered = AccidentsData.features.filter((feature: any) => {
        const datum = feature.properties?.datum;
        const parts = datum.split("/");
        if (parts.length !== 3) return false;
        const mesic = parts[1]; // month
        const rok = parts[2]; // year
        return (
          (selectedAccidentYear2 === "-" ||
            parseInt(rok) === parseInt(selectedAccidentYear2)) &&
          (selectedAccidentMonth2 === "-" ||
            parseInt(mesic, 10) === parseInt(selectedAccidentMonth2, 10))
        );
      });
      setFilteredAccidentsData2({ features: filtered });
    }
  }, [selectedAccidentYear2, selectedAccidentMonth2, AccidentsData]);

  // Avoid rendering on server side
  if (!isClient) return null;

  // This function prepares data for a stacked radar chart based on year, month and mode (summary, intervals, ratio)
  const getStackedRadarChartData = (
    year: string,
    month: string,
    mode: string
  ) => {
    // Prepare raw data from all radar locations
    const raw = RadarsData?.features?.map((feature: any) => {
      const measurements = feature.properties?.mereni || [];

      // Filter measurements based on selected year and month
      const matching = measurements.filter((m: any) => {
        const datumText = m.datum_text;
        const yearFromData = datumText?.slice(0, 4);
        const monthFromData = datumText?.slice(4, 6);

        return (
          typeof datumText === "string" &&
          (year === "-" || yearFromData === year) &&
          (month === "-" || parseInt(monthFromData, 10) === parseInt(month, 10))
        );
      });

      // Aggregate various statistics for the filtered data
      const prujezd_ve_smeru = matching.reduce(
        (sum: number, m: any) =>
          sum + (parseInt(m.pocet_prujezdu_ve_smeru, 10) || 0),
        0
      );

      const prujezd_proti_smeru = matching.reduce(
        (sum: number, m: any) =>
          sum + (parseInt(m.pocet_prujezdu_v_protismeru, 10) || 0),
        0
      );

      const prujezd_soucet = matching.reduce(
        (sum: number, m: any) =>
          sum + (parseInt(m.pocet_prujezdu_soucet, 10) || 0),
        0
      );

      const veSmeru = matching.reduce(
        (sum: number, m: any) =>
          sum + (parseInt(m.prekroceni_rychl_ve_smeru, 10) || 0),
        0
      );

      const vProtismeru = matching.reduce(
        (sum: number, m: any) =>
          sum + (parseInt(m.prekroceni_rychl_v_protismeru, 10) || 0),
        0
      );

      const rychlostni_limit =
        matching.find((m: any) => m.rychlostni_limit != null)
          ?.rychlostni_limit || `${t("unknown")}`;

      // Breakdown of speeding intervals
      const r30_40 = matching.reduce(
        (sum: number, m: any) => sum + (parseFloat(m.r30_40_soucet) || 0),
        0
      );
      const r40_50 = matching.reduce(
        (sum: number, m: any) => sum + (parseFloat(m.r40_50_soucet) || 0),
        0
      );
      const r50_60 = matching.reduce(
        (sum: number, m: any) => sum + (parseFloat(m.r50_60_soucet) || 0),
        0
      );
      const r60_70 = matching.reduce(
        (sum: number, m: any) => sum + (parseFloat(m.r60_70_soucet) || 0),
        0
      );
      const r70_80 = matching.reduce(
        (sum: number, m: any) => sum + (parseFloat(m.r70_80_soucet) || 0),
        0
      );

      return {
        lokalita: feature.properties.lokalita,
        prujezd_ve_smeru,
        prujezd_proti_smeru,
        prujezd_soucet,
        veSmeru,
        vProtismeru,
        rychlostni_limit,
        r30_40,
        r40_50,
        r50_60,
        r60_70,
        r70_80,
      };
    });

    //Filter out locations where no meaningful data is present
    const filtered = raw?.filter(
      (f: any) =>
        f.prujezd_ve_smeru > 0 ||
        f.prujezd_proti_smeru > 0 ||
        f.prujezd_soucet > 0 ||
        f.veSmeru > 0 ||
        f.vProtismeru > 0 ||
        f.r30_40 > 0 ||
        f.r40_50 > 0 ||
        f.r50_60 > 0 ||
        f.r60_70 > 0 ||
        f.r70_80 > 0
    );

    // Tooltip helper arrays
    const lokalitaTooltipMap = filtered?.map(
      (f: any) => `${f.lokalita} (${f.rychlostni_limit} km/h)`
    );

    const labelTooltipMap = filtered?.map((f: any) => {
      if (mode === "summary") {
        return [`${f.lokalita}`, `${f.rychlostni_limit} km/h`];
      } else if (mode === "intervals") {
        return [`${f.lokalita}`, `${f.rychlostni_limit} km/h`];
      } else {
        return [`${f.lokalita}`, `${f.rychlostni_limit} km/h`];
      }
    });

    // Generate x-axis labels like #1, #2, #3, ...
    const labels = lokalitaTooltipMap?.map((_: any, i: any) => `#${i + 1}`);

    // Prepare data arrays for the chart
    const dataVeSmeru = filtered?.map((f: any) => f.veSmeru); // number of cars that were speeding in the driving direction
    const dataVProtismeru = filtered?.map((f: any) => f.vProtismeru); // number of cars that were speeding in the opposite direction
    const dataPrujezdVeSmeru = filtered?.map((f: any) => f.prujezd_ve_smeru); // number of cars that passed in the driving direction
    const dataPrujezdVProtismeru = filtered?.map(
      (f: any) => f.prujezd_proti_smeru
    ); // number of cars that passed in the opposite direction

    const r30_40 = filtered?.map((f: any) => f.r30_40);
    const r40_50 = filtered?.map((f: any) => f.r40_50);
    const r50_60 = filtered?.map((f: any) => f.r50_60);
    const r60_70 = filtered?.map((f: any) => f.r60_70);
    const r70_80 = filtered?.map((f: any) => f.r70_80);

    // Common tooltip configuration used in all modes
    const commonOptions = {
      plugins: {
        tooltip: {
          callbacks: {
            title: (ctx: any) => {
              const i = ctx[0].dataIndex;
              return labelTooltipMap?.[i] || `${t("unknown")}`;
            },
            label: (ctx: any) => {
              const datasetLabel = ctx.dataset.label;
              const value = Number(ctx.raw);
              const index = ctx.dataIndex;

              if (mode === "ratio") {
                let total = 0;
                if (datasetLabel === t("cars_speeding_in_direction")) {
                  total = dataPrujezdVeSmeru?.[index] || 0;
                } else if (datasetLabel === t("cars_speeding_opposite")) {
                  total = dataPrujezdVProtismeru?.[index] || 0;
                }

                if (total > 0) {
                  const percent = ((value / total) * 100).toFixed(3);
                  return `${value.toLocaleString()} ${t(
                    "cars"
                  )} (${percent} %)`;
                }
              }
              if (mode === "intervals") {
                return `${value.toLocaleString()} ${t("cars")} ${t("passed")} `;
              } else {
                return `${value.toLocaleString()} ${t("cars")}`;
              }
            },
          },
        },
      },
    };

    // chart config for each mode
    if (mode === "summary") {
      return {
        labels,
        datasets: [
          {
            label: `${t("in_direction")}`,
            data: dataVeSmeru,
            backgroundColor: "#3b82f6",
          },
          {
            label: `${t("opposite_direction")}`,
            data: dataVProtismeru,
            backgroundColor: "#ef4444",
          },
        ],
        options: commonOptions,
        lokalitaTooltipMap,
      };
    } else if (mode === "intervals") {
      return {
        labels,
        datasets: [
          {
            label: "30–40 km/h",
            data: r30_40,
            backgroundColor: "#86efac",
          },
          {
            label: "40–50 km/h",
            data: r40_50,
            backgroundColor: "#22c55e",
          },
          {
            label: "50–60 km/h",
            data: r50_60,
            backgroundColor: "#facc15",
          },
          {
            label: "60–70 km/h",
            data: r60_70,
            backgroundColor: "#f97316",
          },
          {
            label: "70–80 km/h",
            data: r70_80,
            backgroundColor: "#ef4444",
          },
        ],
        options: commonOptions,
        lokalitaTooltipMap,
      };
    } else {
      return {
        labels,
        datasets: [
          {
            label: t("cars_passed_in_direction"),
            data: dataPrujezdVeSmeru,
            backgroundColor: "#86efac",
          },
          {
            label: t("cars_speeding_in_direction"),
            data: dataVeSmeru,
            backgroundColor: "#22c55e",
          },
          {
            label: t("cars_passed_opposite"),
            data: dataPrujezdVProtismeru,
            backgroundColor: "#facc15",
          },
          {
            label: t("cars_speeding_opposite"),
            data: dataVProtismeru,
            backgroundColor: "#f97316",
          },
        ],
        options: commonOptions,
        lokalitaTooltipMap,
      };
    }
  };

  const getAccidentsChartData = (sourceData = filteredAccidentsData) => {
    // Extract features (individual accident records) from the data
    const filteredData = sourceData?.features;

    // Define labels for chart categories
    const labels = [
      `${t("fatal_injury")}`,
      `${t("minor_injury")}`,
      `${t("serious_injury")}`,
      `${t("no_injury")}`,
    ];

    if (!filteredData) {
      return { data: { labels, datasets: [] }, options: {} };
    }

    // Initialize counters for each injury type
    let smrt = 0; // fatalities
    let lehke = 0; // minor injuries
    let tezke = 0; // serious injuries
    let bez = 0; // people without injury

    for (const f of filteredData) {
      // Parse injury counts from the accident properties
      const s = parseInt(f.properties.smrt, 10) || 0;
      const l = parseInt(f.properties.lehce_zraneno_osob, 10) || 0;
      const t = parseInt(f.properties.tezce_zraneno_osob, 10) || 0;

      smrt += s;
      lehke += l;
      tezke += t;

      if (s === 0 && l === 0 && t === 0) {
        const chodci = f.properties.chodci || [];
        const nasledky = f.properties.nasledky_ve_vozidle || [];
        bez += chodci.length + nasledky.length;
      }
    }

    const originalData = [smrt, lehke, tezke, bez];

    // Transform data using logarithmic scale for better chart visualization from original data
    const logData = originalData.map((val) =>
      val > 0 ? Math.log10(val + 1) : 0
    );

    // chart data and configuration
    return {
      data: {
        labels,
        datasets: [
          {
            data: logData,
            backgroundColor: ["black", "green", "orange", "gray"],
            borderColor: "white",
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: (ctx: any) => {
                const i = ctx.dataIndex;
                return `${originalData[i]} ${t("persons")}`;
              },
            },
          },
        },
      },
    };
  };

  return (
    <div className="mb-5 font-[family-name:var(--font-geist-sans)]">
      {/* Page title and introductory text */}
      <h1 className="text-2xl font-bold mt-24 px-10 py-5">{`${t("stats")}`}</h1>
      <p className="px-5">{`${t("stats_intro")}`}</p>

      {/* Main content layout with two columns: radar stats on the left, accidents on the right */}
      <div className="flex flex-row md:p-7 p-4 md:gap-8 gap-3">
        {/* Left column – Radar chart(s) */}
        <div className="flex flex-col w-[62.5%] text-center gap-2">
          {/* First radar chart */}
          <RadarChartSection
            year={selectedRadarYear}
            month={selectedRadarMonth}
            chartMode={radarChartMode}
            onYearChange={setSelectedRadarYear}
            onMonthChange={setSelectedRadarMonth}
            onChartModeChange={setRadarChartMode}
            chartData={getStackedRadarChartData(
              selectedRadarYear,
              selectedRadarMonth,
              radarChartMode
            )}
            months={months}
          />

          {/* Button to toggle visibility of second radar chart */}
          <button
            className="border w-6 h-6 text-plus-button-text rounded bg-plus-button-bg hover:bg-plus-button-bg-hover hover:text-plus-button-text-hover flex items-center justify-center"
            onClick={() => setShowSecondRadarsStats((p) => !p)}
          >
            {showSecondRadarsStats ? "-" : "+"}
          </button>

          {/* Second radar chart (conditionally rendered) */}
          {showSecondRadarsStats && (
            <RadarChartSection
              year={selectedRadarYear2}
              month={selectedRadarMonth2}
              chartMode={radarChartMode2}
              onYearChange={setSelectedRadarYear2}
              onMonthChange={setSelectedRadarMonth2}
              onChartModeChange={setRadarChartMode2}
              chartData={getStackedRadarChartData(
                selectedRadarYear2,
                selectedRadarMonth2,
                radarChartMode2
              )}
              months={months}
            />
          )}
        </div>

        {/* Right column – Accident chart(s) */}
        <div className="flex flex-col w-[37.5%] text-center gap-2">
          {/* First accident chart */}
          <AccidentChartSection
            year={selectedAccidentYear}
            month={selectedAccidentMonth}
            onYearChange={setSelectedAccidentYear}
            onMonthChange={setSelectedAccidentMonth}
            chartData={getAccidentsChartData(filteredAccidentsData)}
            months={months}
          />

          {/* Button to toggle visibility of second accident chart */}
          <button
            className="border w-6 h-6 text-plus-button-text rounded bg-plus-button-bg hover:bg-plus-button-bg-hover hover:text-plus-button-text-hover flex items-center justify-center"
            onClick={() => setShowSecondAccidentsStats((p) => !p)}
          >
            {showSecondAccidentsStats ? "-" : "+"}
          </button>

          {/* Second accident chart (conditionally rendered) */}
          {showSecondAccidentsStats && (
            <AccidentChartSection
              year={selectedAccidentYear2}
              month={selectedAccidentMonth2}
              onYearChange={setSelectedAccidentYear2}
              onMonthChange={setSelectedAccidentMonth2}
              chartData={getAccidentsChartData(filteredAccidentsData2)}
              months={months}
            />
          )}
        </div>
      </div>

      {/* Page footer */}
      <FooterSection />
    </div>
  );
}
