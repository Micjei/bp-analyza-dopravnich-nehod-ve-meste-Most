import { Bar } from "react-chartjs-2";
import CustomSelect from "@/components/CustomSelect";
import { years } from "@/utils/selectOptions";

type Props = {
  title: string;
  year: string;
  month: string;
  chartMode: "souhrn" | "intervaly";
  onYearChange: (year: string) => void;
  onMonthChange: (month: string) => void;
  onChartModeChange: (mode: "souhrn" | "intervaly") => void;
  chartData: any;
  months: string[];
};

export default function RadarChartSection({
  title,
  year,
  month,
  chartMode,
  onYearChange,
  onMonthChange,
  onChartModeChange,
  chartData,
  months,
}: Props) {
  return (
    <div className="h-[330px]">
      <label>{title}</label>
      <div className="flex flex-row gap-2">
        <CustomSelect
          options={["-", ...years.map(String)]}
          value={year === "-" ? "yy" : year}
          onChange={onYearChange}
        />
        <CustomSelect
          options={months}
          value={month === "-" ? "mm" : month}
          onChange={onMonthChange}
        />
        <CustomSelect
          options={["souhrn", "intervaly"]}
          value={chartMode}
          onChange={(mode) => onChartModeChange(mode as "souhrn" | "intervaly")}
        />
      </div>

      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { position: "top" },
            title: {
              display: true,
              text: `Překročení rychlosti dle radarů (${year})`,
            },
            tooltip: chartData.options?.plugins?.tooltip,
          },
          scales: {
            x: { stacked: false },
            y: {
              type: chartMode === "intervaly" ? "logarithmic" : "linear",
              min: 1,
              stacked: false,
              ticks: {
                callback: (value: any) => Number(value).toLocaleString(),
              },
            },
          },
        }}
      />

      <div className="flex flex-wrap gap-4 mt-2 text-xs text-left">
        {chartData.lokalitaTooltipMap?.map((label: string, i: number) => (
          <div key={i}>
            <strong>#{i + 1}</strong>: {label}
          </div>
        ))}
      </div>
    </div>
  );
}
