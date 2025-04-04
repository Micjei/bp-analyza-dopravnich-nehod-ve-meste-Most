import { Doughnut } from "react-chartjs-2";
import CustomSelect from "@/components/CustomSelect";
import { years } from "@/utils/selectOptions";

type Props = {
  title: string;
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
  title,
  year,
  month,
  onYearChange,
  onMonthChange,
  chartData,
  months,
}: Props) {
  return (
    <div className="h-[330px]">
      <label>{title}</label>
      <div className="flex flex-row gap-2 mb-2">
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
      </div>

      <Doughnut data={chartData.data} options={chartData.options} />
    </div>
  );
}
