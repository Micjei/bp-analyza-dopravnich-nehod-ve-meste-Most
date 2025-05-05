"use client";

// React hooks
import { useEffect, useState } from "react";

// Chart component
import { Doughnut } from "react-chartjs-2";

// Custom UI components and utilities
import CustomSelect from "@/components/CustomSelect";
import { years } from "@/utils/selectOptions";

// i18n translation hook
import { useTranslation } from "react-i18next";
import "@/i18n"; // Translation initialization

// Type definition for component props
type Props = {
  year: string;
  month: string;
  onYearChange: (year: string) => void;
  onMonthChange: (month: string) => void;
  chartData: {
    data: any;
    options: any;
  };
  months: string[];
};

// Main component definition
export default function AccidentChartSection({
  year,
  month,
  onYearChange,
  onMonthChange,
  chartData,
  months,
}: Props) {
  const { t } = useTranslation(); // Translation function
  const [isClient, setIsClient] = useState(false); // Used to avoid rendering before hydration on the server

  // Set client flag after mounting to avoid SSR mismatches
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Prevent rendering on the server
  if (!isClient) return null;

  return (
    <div className="h-[330px] flex flex-col">
      {/* Section label */}
      <label>{t("accidents_stats")}</label>

      {/* Year and month dropdowns */}
      <div className="flex flex-row md:gap-2 gap-0.5 mb-1">
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
      </div>

      {/* Doughnut chart section */}
      <div className="flex-1 overflow-hidden">
        <Doughnut
          data={chartData.data}
          options={{
            ...chartData.options,
            maintainAspectRatio: false,
            plugins: {
              ...chartData.options?.plugins,
              legend: {
                position: "top",
                align: "start",
                labels: {
                  boxWidth: 20,
                  padding: 8,
                  font: {
                    size: 11,
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
