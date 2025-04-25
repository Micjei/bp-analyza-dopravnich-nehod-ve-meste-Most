"use client";

import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import CustomSelect from "@/components/CustomSelect";
import { years } from "@/utils/selectOptions";
import { useTranslation } from "react-i18next";
import "@/i18n";

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

export default function AccidentChartSection({
  year,
  month,
  onYearChange,
  onMonthChange,
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
      <label>{t("accidents_stats")}</label>
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
