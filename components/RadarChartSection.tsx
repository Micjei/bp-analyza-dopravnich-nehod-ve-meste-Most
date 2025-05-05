"use client";

import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2"; // Bar chart component from Chart.js
import CustomSelect from "@/components/CustomSelect"; // Custom dropdown component
import { years } from "@/utils/selectOptions"; // List of years
import { useTranslation } from "react-i18next"; // Internationalization
import "@/i18n"; // i18n configuration

// Props type definition
type Props = {
  year: string;
  month: string;
  chartMode: "summary" | "intervals" | "ratio";
  onYearChange: (year: string) => void;
  onMonthChange: (month: string) => void;
  onChartModeChange: (mode: "summary" | "intervals" | "ratio") => void;
  chartData: any;
  months: string[];
};

export default function RadarChartSection({
  year,
  month,
  chartMode,
  onYearChange,
  onMonthChange,
  onChartModeChange,
  chartData,
  months,
}: Props) {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  // Ensure rendering only on the client side (important for Chart.js)
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="h-[330px] flex flex-col">
      {/* Section title */}
      <label>{t("radar_stats")}</label>

      {/* Filter controls: year, month, chart mode */}
      <div className="flex flex-row md:gap-2 gap-0.5 mb-1">
        {/* Year select */}
        <CustomSelect
          options={["-", ...years.map(String)]}
          value={year === "-" ? `${t("yy")}` : year}
          onChange={onYearChange}
        />
        {/* Month select */}
        <CustomSelect
          options={months}
          value={month === "-" ? `${t("mm")}` : month}
          onChange={onMonthChange}
        />
        {/* Chart mode select: summary / intervals / ratio */}
        <CustomSelect
          options={[
            { value: "summary", label: t("summary") },
            { value: "intervals", label: t("intervals") },
            { value: "ratio", label: t("ratio") },
          ]}
          value={chartMode}
          onChange={(mode) =>
            onChartModeChange(mode as "summary" | "intervals" | "ratio")
          }
        />
      </div>

      {/* Chart rendering */}
      <div className="flex-1 overflow-hidden">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top", // Position of legend
                align: "start", // Align legend items to the start (left)
                labels: {
                  boxWidth: 20, // Size of the colored box in legend
                  padding: 8,
                  font: { size: 11 }, // Smaller font for better mobile fit
                },
              },
              title: {
                display: true,
                text: `${t("chart_title", { year })}`, // Dynamic title with year
              },
              tooltip: chartData.options?.plugins?.tooltip, // Tooltip config from props
            },
            scales: {
              x: { stacked: false }, // No stacking on x-axis
              y: {
                type:
                  chartMode === "intervals" || chartMode === "ratio"
                    ? "logarithmic"
                    : "linear", // Use log scale for some modes
                min: 1,
                stacked: false,
                ticks: {
                  // Format Y-axis values
                  callback: (value: any) => Number(value).toLocaleString(),
                },
              },
            },
          }}
        />
      </div>

      {/* Optional labels/legend list below the chart */}
      <div className="flex flex-wrap gap-1 mt-1 text-xs text-left overflow-y-auto max-h-[60px]">
        {chartData.lokalitaTooltipMap?.map((label: string, i: number) => (
          <div key={i}>
            <strong>#{i + 1}</strong>: {label}
          </div>
        ))}
      </div>
    </div>
  );
}
