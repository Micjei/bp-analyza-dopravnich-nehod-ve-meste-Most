"use client";

import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import CustomSelect from "@/components/CustomSelect";
import { years } from "@/utils/selectOptions";
import { useTranslation } from "react-i18next";
import "@/i18n";

type Props = {
  year: string;
  month: string;
  chartMode: "summary" | "intervals";
  onYearChange: (year: string) => void;
  onMonthChange: (month: string) => void;
  onChartModeChange: (mode: "summary" | "intervals") => void;
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

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="h-[330px] flex flex-col">
      <label>{t("radar_stats")}</label>

      <div className="flex flex-row md:gap-2 gap-1 mb-1">
        <CustomSelect
          options={["-", ...years.map(String)]}
          value={year === "-" ? `${t("yy")}` : year}
          onChange={onYearChange}
        />
        <CustomSelect
          options={months}
          value={month === "-" ? `${t("mm")}` : month}
          onChange={onMonthChange}
        />
        <CustomSelect
          options={[
            { value: "summary", label: t("summary") },
            { value: "intervals", label: t("intervals") },
          ]}
          value={chartMode}
          onChange={(mode) =>
            onChartModeChange(mode as "summary" | "intervals")
          }
        />
      </div>

      <div className="flex-1 overflow-hidden">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "top" },
              title: {
                display: true,
                text: `${t("chart_title", {
                  year,
                })}`,
              },
              tooltip: chartData.options?.plugins?.tooltip,
            },
            scales: {
              x: { stacked: false },
              y: {
                type: chartMode === "intervals" ? "logarithmic" : "linear",
                min: 1,
                stacked: false,
                ticks: {
                  callback: (value: any) => Number(value).toLocaleString(),
                },
              },
            },
          }}
        />
      </div>

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
