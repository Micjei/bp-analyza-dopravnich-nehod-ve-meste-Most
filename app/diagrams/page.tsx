"use client";

import React, { useEffect, useState } from "react";
import HeaderSection from "@/components/HeaderSection";
import FooterSection from "@/components/FooterSection";
import { fetchRadarsData, fetchAccidentsData } from "@/utils/fetchData";
import { Chart, Doughnut } from "react-chartjs-2";
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
  const [selectedRadarYear, setSelectedRadarYear] = useState("2023");
  const [selectedAccidentYear, setSelectedAccidentYear] = useState("2023");
  const [lastUpdate, setLastUpdate] = useState<string>("");

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
        const formattedPeriod = feature.properties?.datum;
        if (!formattedPeriod || typeof formattedPeriod !== "string")
          return false;

        const parts = formattedPeriod.split(" ");
        const year = parts[1];

        return selectedRadarYear === "-" || year === selectedRadarYear;
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

  const getRadarChartData = () => {
    const filteredData = filteredRadarsData?.features;
    if (!filteredData) return { labels: [], datasets: [] };

    const labels = filteredData.map(
      (feature: any) => feature.properties.lokalita
    );
    const dataValues = filteredData.map((feature: any) =>
      feature.properties.mereni.reduce((acc: any, measurement: any) => {
        return acc + (measurement.prekroceni_rychlost_soucet || 0);
      }, 0)
    );

    return {
      labels,
      datasets: [
        {
          label: "Překročení rychlosti",
          data: dataValues,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  const getAccidentsChartData = () => {
    const filteredData = filteredAccidentsData?.features;
    if (!filteredData) return { labels: [], datasets: [] };

    // Definování popisů místo datumu
    const labels = [
      "Smrtelná zranění",
      "Lehce zraněné osoby",
      "Těžce zraněné osoby",
    ];

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

    return {
      labels, // Použití popisů místo dat
      datasets: [
        {
          label: "Počet osob",
          data: [smrt, lehkeZraneni, tezkeZraneni],
          backgroundColor: ["black", "green", "orange"],
          borderColor: "red",
          borderWidth: 1,
        },
      ],
      options: {
        scales: {
          x: {
            title: { display: true, text: "Typ zranění" },
          },
          y: {
            title: { display: true, text: "Počet osob" },
            beginAtZero: true,
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
        <div className="w-full md:w-1/2">
          <label>Vyber rok pro radary: </label>
          <CustomSelect
            options={years.map(String)}
            value={selectedRadarYear}
            onChange={(option) => setSelectedRadarYear(option)}
          />
          {filteredRadarsData ? (
            <Chart
              type="radar"
              data={getRadarChartData()}
              options={{ responsive: true }}
            />
          ) : (
            <p>Načítání radarových dat...</p>
          )}
        </div>

        <div className="w-full md:w-1/2">
          <label>Vyber rok pro nehody: </label>
          <CustomSelect
            options={years.map(String)}
            value={selectedAccidentYear}
            onChange={(option) => setSelectedAccidentYear(option)}
          />
          {filteredAccidentsData ? (
            <Doughnut
              data={getAccidentsChartData()}
              options={{ responsive: true }}
            />
          ) : (
            <p>Načítání nehodových dat...</p>
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
