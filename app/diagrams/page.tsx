"use client";

import React, { useEffect, useState } from "react";
import HeaderSection from "@/components/HeaderSection";
import FooterSection from "@/components/FooterSection";
import { fetchRadarsData, fetchAccidentsData } from "@/utils/fetchData";
import { Chart, Doughnut, Bar } from "react-chartjs-2";
import { getCurrentYear, years, isLeapYear } from "@/utils/selectOptions";
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
import { Lavishly_Yours } from "next/font/google";

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

export default function DashboardPage() {
  const [radarsData, setRadarsData] = useState<any>(null);
  const [accidentsData, setAccidentsData] = useState<any>(null);
  const [filteredRadarsData, setFilteredRadarsData] = useState<any>(null); // filtered radars data
  const [filteredAccidentsData, setFilteredAccidentsData] = useState<any>(null); // filtered accidents data
  const [filteredAccidentsData2, setFilteredAccidentsData2] =
    useState<any>(null); // filtered accidents data 2

  const [selectedRadarYear, setSelectedRadarYear] = useState("2023");
  const [selectedAccidentYear, setSelectedAccidentYear] = useState("2023");
  const [selectedAccidentYear2, setSelectedAccidentYear2] = useState("2023");
  const [lastUpdate, setLastUpdate] = useState<string>("");

  const [showSecondStats, setShowSecondStats] = useState<boolean>(false);

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
    // Filter radar data based on selected year and month
    if (radarsData && radarsData.features) {
      const filtered = radarsData.features.filter((feature: any) => {
        const measurements = feature.properties?.mereni || [];

        return measurements.some((m: any) => {
          const datum = m.datum_text;
          return (
            typeof datum === "string" && datum.startsWith(selectedRadarYear)
          );
        });
      });

      setFilteredRadarsData({ features: filtered });
    }

    // Filter accident data based on selected year
    if (accidentsData) {
      const filtered = accidentsData.features.filter((feature: any) => {
        const date = feature.properties?.datum;
        return date && date.endsWith(selectedAccidentYear);
      });

      setFilteredAccidentsData({ features: filtered });
    }
  }, [selectedRadarYear, selectedAccidentYear, radarsData, accidentsData]);

  useEffect(() => {
    if (accidentsData) {
      const filtered = accidentsData.features.filter((feature: any) => {
        const date = feature.properties?.datum;
        return date && date.endsWith(selectedAccidentYear2);
      });

      setFilteredAccidentsData2({ features: filtered });
    }
  }, [selectedAccidentYear2, accidentsData]);

  const getStackedRadarChartData = () => {
    const filtered = radarsData?.features?.map((feature: any) => {
      const measurements = feature.properties?.mereni || [];

      // Najdi měření pro vybraný rok podle datum_text ve formátu yyyymmdd
      const matching = measurements.filter((m: any) => {
        return (
          typeof m.datum_text === "string" &&
          m.datum_text.startsWith(selectedRadarYear)
        );
      });

      // Sečti překročení ve směru
      const veSmeru = matching.reduce(
        (sum: number, m: any) =>
          sum + (parseInt(m.prekroceni_rychl_ve_smeru, 10) || 0),
        0
      );

      // Sečti překročení v protisměru
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
        {
          label: "Ve směru",
          data: dataVeSmeru,
          backgroundColor: "#3b82f6",
        },
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

    // možno smazat
    if (!filteredData) {
      return {
        data: {
          labels,
          datasets: [],
        },
        options: {},
      };
    }

    const smrt = filteredData.reduce(
      (sum: number, feature: any) =>
        sum + (parseInt(feature.properties.smrt, 10) || 0),
      0
    );
    const lehkeZraneni = filteredData.reduce(
      (sum: number, feature: any) =>
        sum + (parseInt(feature.properties.lehce_zraneno_osob, 10) || 0),
      0
    );
    const tezkeZraneni = filteredData.reduce(
      (sum: number, feature: any) =>
        sum + (parseInt(feature.properties.tezce_zraneno_osob, 10) || 0),
      0
    );
    const bezZraneni = filteredData.reduce((sum: number, feature: any) => {
      const smrt = parseInt(feature.properties.smrt, 10) || 0;
      const lehke = parseInt(feature.properties.lehce_zraneno_osob, 10) || 0;
      const tezke = parseInt(feature.properties.tezce_zraneno_osob, 10) || 0;
      return smrt === 0 && lehke === 0 && tezke === 0 ? sum + 1 : sum;
    }, 0);

    const originalData = [smrt, lehkeZraneni, tezkeZraneni, bezZraneni];
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
              label: function (context: any) {
                const index = context.dataIndex;
                const label = labels[index];
                const original = originalData[index];
                return `${label}: ${original} osob`;
              },
            },
          },
        },
      },
    };
  };

  return (
    <div className="mb-5">
      <HeaderSection />
      <h1 className="text-2xl font-bold mt-24">Dashboard</h1>
      <p>Vítej v dashboardu!</p>
      <h2 className="text-xl mt-8">Radarová a nehodová data</h2>

      <div className="flex flex-row gap-8 mt-4 w-auto p-10">
        {/* Radarový graf */}
        <div className="flex flex-col gap-8 w-8/12">
          <div>
            <label>Vyber rok pro radary: </label>
            <CustomSelect
              options={years.map(String)}
              value={selectedRadarYear}
              onChange={(option) => setSelectedRadarYear(option)}
            />
            {filteredRadarsData ? (
              <Bar
                data={getStackedRadarChartData()}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                    title: {
                      display: true,
                      text: `Překročení rychlosti dle radarů (${selectedRadarYear})`,
                    },
                  },
                  scales: {
                    x: {
                      stacked: true,
                    },
                    y: {
                      stacked: true,
                      beginAtZero: true,
                    },
                  },
                }}
              />
            ) : (
              <p>Načítání radarových dat...</p>
            )}
          </div>
          {/* Button pro druhý graf */}
          <button
            className="border w-6 h-6 rounded bg-gray-200 hover:bg-gray-300"
            onClick={() => setShowSecondStats((prev) => !prev)}
          >
            {showSecondStats ? "-" : "+"}
          </button>
          {/* Druhý graf (volitelný) */}
          {showSecondStats && (
            <div>
              <label>Vyber rok pro radary: </label>
              <CustomSelect
                options={years.map(String)}
                value={selectedRadarYear}
                onChange={(option) => setSelectedRadarYear(option)}
              />
              {filteredRadarsData ? (
                <Bar
                  data={getStackedRadarChartData()}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "top",
                      },
                      title: {
                        display: true,
                        text: `Překročení rychlosti dle radarů (${selectedRadarYear})`,
                      },
                    },
                    scales: {
                      x: {
                        stacked: true,
                      },
                      y: {
                        stacked: true,
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              ) : (
                <p>Načítání radarových dat...</p>
              )}
            </div>
          )}
        </div>

        {/* Nehodové grafy pod sebou */}
        <div className="flex flex-col gap-8 w-1/4">
          {/* První graf */}
          <div>
            <label>Vyber rok pro nehody: </label>
            <CustomSelect
              options={years.map(String)}
              value={selectedAccidentYear}
              onChange={(option) => setSelectedAccidentYear(option)}
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

          {/* Button pro druhý graf */}
          <button
            className="border w-6 h-6 rounded bg-gray-200 hover:bg-gray-300"
            onClick={() => setShowSecondStats((prev) => !prev)}
          >
            {showSecondStats ? "-" : "+"}
          </button>

          {/* Druhý graf (volitelný) */}
          {showSecondStats && (
            <div>
              <label>Vyber druhý rok pro nehody: </label>
              <CustomSelect
                options={years.map(String)}
                value={selectedAccidentYear2}
                onChange={(option) => setSelectedAccidentYear2(option)}
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

      <FooterSection
        footerText="Čas poslední aktualizace:"
        lastUpdate={lastUpdate}
      />
    </div>
  );
}
