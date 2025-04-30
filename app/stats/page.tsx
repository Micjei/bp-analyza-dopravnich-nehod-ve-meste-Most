"use client";

import "../../app/globals.css";
import React, { useEffect, useState } from "react";
import HeaderSection from "@/components/HeaderSection";
import FooterSection from "@/components/FooterSection";
import { fetchRadarsData, fetchAccidentsData } from "@/utils/fetchData";
import { Chart, Doughnut, Bar } from "react-chartjs-2";
import { getCurrentYear, years } from "@/utils/selectOptions";
import CustomSelect from "@/components/CustomSelect";
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
import { useData } from "@/context/DataContext";
import { div } from "framer-motion/client";
import RadarChartSection from "@/components/RadarChartSection";
import AccidentChartSection from "@/components/AccidentChartSection";
import { useTranslation } from "react-i18next";
import "@/i18n";

export default function StatsPage() {
  const { t } = useTranslation();

  const { RadarsData, AccidentsData } = useData();

  //const [RadarsData, setRadarsData] = useState<any>(null);
  const [selectedRadarYear, setSelectedRadarYear] = useState("2022");
  const [selectedRadarYear2, setSelectedRadarYear2] = useState("2022");
  const [selectedRadarMonth, setSelectedRadarMonth] = useState("-");
  const [selectedRadarMonth2, setSelectedRadarMonth2] = useState("-");
  const [showSecondRadarsStats, setShowSecondRadarsStats] = useState(false);

  //const [AccidentsData, setAccidentsData] = useState<any>(null);
  const [filteredAccidentsData, setFilteredAccidentsData] = useState<any>(null);
  const [filteredAccidentsData2, setFilteredAccidentsData2] =
    useState<any>(null);
  const [selectedAccidentYear, setSelectedAccidentYear] = useState("-");
  const [selectedAccidentYear2, setSelectedAccidentYear2] = useState("-");
  const [selectedAccidentMonth, setSelectedAccidentMonth] = useState("-");
  const [selectedAccidentMonth2, setSelectedAccidentMonth2] = useState("-");
  //const selectedAccidentDay = "1"; // smazat
  const [showSecondAccidentsStats, setShowSecondAccidentsStats] =
    useState(false);
  const months = [
    "-",
    ...Array.from({ length: 12 }, (_, i) => (i + 1).toString()),
  ];
  type RadarChartMode = "summary" | "intervals" | "ratio";

  const [radarChartMode, setRadarChartMode] =
    useState<RadarChartMode>("summary");

  const [radarChartMode2, setRadarChartMode2] =
    useState<RadarChartMode>("summary");

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (AccidentsData) {
      const filtered = AccidentsData.features.filter((feature: any) => {
        const datum = feature.properties?.datum;
        const parts = datum.split("/");
        if (parts.length !== 3) return false;
        const mesic = parts[1];
        const rok = parts[2];
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

  useEffect(() => {
    if (AccidentsData) {
      const filtered = AccidentsData.features.filter((feature: any) => {
        const datum = feature.properties?.datum;
        const parts = datum.split("/");
        if (parts.length !== 3) return false;
        const mesic = parts[1];
        const rok = parts[2];
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

  if (!isClient) return null;

  const getStackedRadarChartData = (
    year: string,
    month: string,
    mode: string
  ) => {
    const raw = RadarsData?.features?.map((feature: any) => {
      const measurements = feature.properties?.mereni || [];

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
          ?.rychlostni_limit || "nezjištěno";

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
    const lokalitaTooltipMap = filtered?.map(
      (f: any) => `${f.lokalita} (${f.rychlostni_limit} km/h)`
    );

    const labelTooltipMap = filtered?.map((f: any) => {
      if (mode === "summary") {
        return [
          `${f.lokalita}`,
          `${f.rychlostni_limit} km/h`,
          //`aut ${f.prujezd_ve_smeru} ve směru`, // tolik aut projelo
          //`aut ${f.prujezd_proti_smeru} v protisměru`, // tolik aut projelo
        ];
      } else if (mode === "intervals") {
        return [
          `${f.lokalita}`,
          `${f.rychlostni_limit} km/h`,
          //`∑ ${f.prujezd_soucet} průjezdů`, // tolik aut projelo
        ];
      } else {
        // pokus pro poměry
        return [
          `${f.lokalita}`,
          `${f.rychlostni_limit} km/h`,
          //`aut ${f.prujezd_ve_smeru} ve směru`, // tolik aut projelo
          //`aut ${f.prujezd_proti_smeru} v protisměru`, // tolik aut projelo
        ];
      }
    });

    const labels = lokalitaTooltipMap?.map((_: any, i: any) => `#${i + 1}`);
    const dataVeSmeru = filtered?.map((f: any) => f.veSmeru); // tolik aut překročilo rychlost ve smeru
    const dataVProtismeru = filtered?.map((f: any) => f.vProtismeru); // tolik aut překročilo rychlost v protismeru
    const dataPrujezdVeSmeru = filtered?.map((f: any) => f.prujezd_ve_smeru); // tolik aut projelo ve smeru
    const dataPrujezdVProtismeru = filtered?.map(
      (f: any) => f.prujezd_proti_smeru
    ); // tolik aut projelo v protismeru
    const r30_40 = filtered?.map((f: any) => f.r30_40);
    const r40_50 = filtered?.map((f: any) => f.r40_50);
    const r50_60 = filtered?.map((f: any) => f.r50_60);
    const r60_70 = filtered?.map((f: any) => f.r60_70);
    const r70_80 = filtered?.map((f: any) => f.r70_80);

    const commonOptions = {
      plugins: {
        tooltip: {
          callbacks: {
            title: (ctx: any) => {
              const i = ctx[0].dataIndex;
              return labelTooltipMap?.[i] || "Neznámá lokalita";
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
    const filteredData = sourceData?.features;

    const labels = [
      `${t("fatal_injury")}`,
      `${t("minor_injury")}`,
      `${t("serious_injury")}`,
      `${t("no_injury")}`,
    ];

    if (!filteredData) {
      return { data: { labels, datasets: [] }, options: {} };
    }

    let smrt = 0;
    let lehke = 0;
    let tezke = 0;
    let bez = 0;

    for (const f of filteredData) {
      const s = parseInt(f.properties.smrt, 10) || 0;
      const l = parseInt(f.properties.lehce_zraneno_osob, 10) || 0;
      const t = parseInt(f.properties.tezce_zraneno_osob, 10) || 0;

      smrt += s;
      lehke += l;
      tezke += t;

      if (s === 0 && l === 0 && t === 0) {
        const chodci = f.properties.chodci || [];
        const nasledky = f.properties.nasledky_ve_vozidle || [];
        bez += chodci.length + nasledky.length; // snad už správný počet
      }
    }

    const originalData = [smrt, lehke, tezke, bez];
    const logData = originalData.map((val) =>
      val > 0 ? Math.log10(val + 1) : 0
    );

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
      {/*<HeaderSection />*/}
      <h1 className="text-2xl font-bold mt-24 px-10 py-5">{`${t("stats")}`}</h1>
      <p className="px-5">{`${t("stats_intro")}`}</p>

      <div className="flex flex-row md:p-7 p-4 md:gap-8 gap-3">
        {/** levý sloupec */}
        <div className="flex flex-col w-[62.5%] text-center gap-2">
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

          <button
            className="border w-6 h-6 text-plus-button-text rounded bg-plus-button-bg hover:bg-plus-button-bg-hover hover:text-plus-button-text-hover flex items-center justify-center"
            onClick={() => setShowSecondRadarsStats((p) => !p)}
          >
            {showSecondAccidentsStats ? "-" : "+"}
          </button>

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

        {/** pravý sloupec */}
        <div className="flex flex-col w-[37.5%] text-center gap-2">
          <AccidentChartSection
            year={selectedAccidentYear}
            month={selectedAccidentMonth}
            onYearChange={setSelectedAccidentYear}
            onMonthChange={setSelectedAccidentMonth}
            chartData={getAccidentsChartData(filteredAccidentsData)}
            months={months}
          />

          <button
            className="border w-6 h-6 text-plus-button-text rounded bg-plus-button-bg hover:bg-plus-button-bg-hover hover:text-plus-button-text-hover flex items-center justify-center"
            onClick={() => setShowSecondAccidentsStats((p) => !p)}
          >
            {showSecondAccidentsStats ? "-" : "+"}
          </button>

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

      <FooterSection />
    </div>
  );
}
