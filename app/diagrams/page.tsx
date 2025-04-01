"use client";

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
  RadialLinearScale
);
import { useData } from "@/context/DataContext";

export default function DashboardPage() {
  const { RadarsData, AccidentsData } = useData();

  //const [RadarsData, setRadarsData] = useState<any>(null);
  const [selectedRadarYear, setSelectedRadarYear] = useState("2023");
  const [selectedRadarYear2, setSelectedRadarYear2] = useState("2023");
  const [showSecondRadarsStats, setShowSecondRadarsStats] = useState(false);

  //const [AccidentsData, setAccidentsData] = useState<any>(null);
  const [filteredAccidentsData, setFilteredAccidentsData] = useState<any>(null);
  const [filteredAccidentsData2, setFilteredAccidentsData2] =
    useState<any>(null);
  const [selectedAccidentYear, setSelectedAccidentYear] = useState("2023");
  const [selectedAccidentYear2, setSelectedAccidentYear2] = useState("2023");
  const [showSecondAccidentsStats, setShowSecondAccidentsStats] =
    useState(false);

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
    if (AccidentsData) {
      const filtered = AccidentsData.features.filter((feature: any) => {
        const date = feature.properties?.datum;
        return date && date.endsWith(selectedAccidentYear);
      });

      setFilteredAccidentsData({ features: filtered });
    }
  }, [selectedAccidentYear, AccidentsData]);

  useEffect(() => {
    if (AccidentsData) {
      const filtered = AccidentsData.features.filter((feature: any) => {
        const date = feature.properties?.datum;
        return date && date.endsWith(selectedAccidentYear2);
      });

      setFilteredAccidentsData2({ features: filtered });
    }
  }, [selectedAccidentYear2, AccidentsData]);

  const getStackedRadarChartData = (year: string) => {
    const filtered = RadarsData?.features?.map((feature: any) => {
      const measurements = feature.properties?.mereni || [];

      const matching = measurements.filter((m: any) => {
        return (
          typeof m.datum_text === "string" && m.datum_text.startsWith(year)
        );
      });

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

      return {
        lokalita: feature.properties.lokalita,
        veSmeru,
        vProtismeru,
      };
    });

    const labels = filtered?.map((f: any) => f.lokalita);
    const dataVeSmeru = filtered?.map((f: any) => f.veSmeru);
    const dataVProtismeru = filtered?.map((f: any) => f.vProtismeru);

    return {
      labels,
      datasets: [
        { label: "Ve směru", data: dataVeSmeru, backgroundColor: "#3b82f6" },
        {
          label: "V protisměru",
          data: dataVProtismeru,
          backgroundColor: "#ef4444",
        },
      ],
    };
  };

  const getAccidentsChartData = (sourceData = filteredAccidentsData) => {
    const filteredData = sourceData?.features;

    const labels = [
      "Smrtelná zranění",
      "Lehce zraněné osoby",
      "Těžce zraněné osoby",
      "Bez zranění",
    ];

    if (!filteredData) {
      return { data: { labels, datasets: [] }, options: {} };
    }

    const smrt = filteredData.reduce(
      (sum: number, f: any) => sum + (parseInt(f.properties.smrt, 10) || 0),
      0
    );
    const lehke = filteredData.reduce(
      (sum: number, f: any) =>
        sum + (parseInt(f.properties.lehce_zraneno_osob, 10) || 0),
      0
    );
    const tezke = filteredData.reduce(
      (sum: number, f: any) =>
        sum + (parseInt(f.properties.tezce_zraneno_osob, 10) || 0),
      0
    );
    const bez = filteredData.reduce((sum: number, f: any) => {
      const s = parseInt(f.properties.smrt, 10) || 0;
      const l = parseInt(f.properties.lehce_zraneno_osob, 10) || 0;
      const t = parseInt(f.properties.tezce_zraneno_osob, 10) || 0;
      return s === 0 && l === 0 && t === 0 ? sum + 1 : sum;
    }, 0);

    const originalData = [smrt, lehke, tezke, bez];
    const logData = originalData.map((val) =>
      val > 0 ? Math.log10(val + 1) : 0
    );

    return {
      data: {
        labels,
        datasets: [
          {
            label: "Počet osob",
            data: logData,
            backgroundColor: ["black", "green", "orange", "gray"],
            borderColor: "red",
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
                return `${labels[i]}: ${originalData[i]} osob`;
              },
            },
          },
        },
      },
    };
  };

  return (
    <div className="mb-5 font-[family-name:var(--font-geist-sans)]">
      <HeaderSection />
      <h1 className="text-2xl font-bold mt-24">Dashboard</h1>
      <h2 className="text-xl mt-8">Radarová a nehodová data</h2>

      <div className="flex flex-row gap-8 mt-4 w-auto p-10">
        <div className="flex flex-col gap-8 w-8/12">
          <div>
            <label>Vyber rok pro radary: </label>
            <CustomSelect
              options={years.map(String)}
              value={selectedRadarYear}
              onChange={setSelectedRadarYear}
            />
            {RadarsData ? (
              <Bar
                data={getStackedRadarChartData(selectedRadarYear)}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "top" },
                    title: {
                      display: true,
                      text: `Překročení rychlosti dle radarů (${selectedRadarYear})`,
                    },
                  },
                  scales: {
                    x: { stacked: true },
                    y: { stacked: true, beginAtZero: true },
                  },
                }}
              />
            ) : (
              <p>Načítání radarových dat...</p>
            )}
          </div>

          <button
            className="border w-6 h-6 rounded bg-gray-200 hover:bg-gray-300"
            onClick={() => setShowSecondRadarsStats((p) => !p)}
          >
            {showSecondRadarsStats ? "-" : "+"}
          </button>

          {showSecondRadarsStats && (
            <div>
              <label>Vyber druhý rok pro radary: </label>
              <CustomSelect
                options={years.map(String)}
                value={selectedRadarYear2}
                onChange={setSelectedRadarYear2}
              />
              {RadarsData ? (
                <Bar
                  data={getStackedRadarChartData(selectedRadarYear2)}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: "top" },
                      title: {
                        display: true,
                        text: `Překročení rychlosti dle radarů (${selectedRadarYear2})`,
                      },
                    },
                    scales: {
                      x: { stacked: true },
                      y: { stacked: true, beginAtZero: true },
                    },
                  }}
                />
              ) : (
                <p>Načítání radarových dat...</p>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-8 w-1/4">
          <div>
            <label>Vyber rok pro nehody: </label>
            <CustomSelect
              options={years.map(String)}
              value={selectedAccidentYear}
              onChange={setSelectedAccidentYear}
            />
            {filteredAccidentsData ? (
              (() => {
                const { data, options } = getAccidentsChartData(
                  filteredAccidentsData
                );
                return <Doughnut data={data} options={options} />;
              })()
            ) : (
              <p>Načítání nehodových dat...</p>
            )}
          </div>

          <button
            className="border w-6 h-6 rounded bg-gray-200 hover:bg-gray-300"
            onClick={() => setShowSecondAccidentsStats((p) => !p)}
          >
            {showSecondAccidentsStats ? "-" : "+"}
          </button>

          {showSecondAccidentsStats && (
            <div>
              <label>Vyber druhý rok pro nehody: </label>
              <CustomSelect
                options={years.map(String)}
                value={selectedAccidentYear2}
                onChange={setSelectedAccidentYear2}
              />
              {filteredAccidentsData2 ? (
                (() => {
                  const { data, options } = getAccidentsChartData(
                    filteredAccidentsData2
                  );
                  return <Doughnut data={data} options={options} />;
                })()
              ) : (
                <p>Načítání druhého grafu...</p>
              )}
            </div>
          )}
        </div>
      </div>

      <FooterSection />
    </div>
  );
}
