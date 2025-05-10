// Returns the current year
export const getCurrentYear = () => new Date().getFullYear();

// Generates an array of years from 2021 to the current year (used in dropdowns)
export const years = Array.from(
  { length: getCurrentYear() - 2020 },
  (_, i) => 2021 + i
);

// Checks if a given year is a leap year
export const isLeapYear = (year: number) => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

// Returns the number of days in a given month and year
export const getDaysInMonth = (month: number, year: number) => {
  const daysInMonth = [
    31, // January
    28 + (isLeapYear(year) ? 1 : 0), // February (29 if leap year)
    31, // March
    30, // April
    31, // May
    30, // June
    31, // July
    31, // August
    30, // September
    31, // October
    30, // November
    31, // December
  ];
  return daysInMonth[month - 1];
};

// Options for filtering alcohol test results (p11)
export const alcoholOptions = (t: (key: string) => string) => [
  { label: "-", value: "-" },
  { label: `${t("yes")}`, value: "ano" },
  { label: `${t("no")}`, value: "2" },
  { label: `${t("measurement_rejected")}`, value: "4" },
  { label: `${t("from")} 0,24 ‰`, value: "1" },
  { label: `${t("from")} 0,24 ${t("to")} 0,5 ‰`, value: "3" },
  { label: `${t("from")} 0,5 ${t("to")} 0,8 ‰`, value: "6" },
  { label: `${t("from")} 0,8 ${t("to")} 1,0 ‰`, value: "7" },
  { label: `${t("from")} 1,0 ${t("to")} 1,5 ‰`, value: "8" },
  { label: `1,5 ‰ ${t("and_more")}`, value: "9" },
  { label: `${t("not_detected")}`, value: "0" },
];

// Options for filtering drug test results (p11a)
export const drugsOptions = (t: (key: string) => string) => [
  { label: "-", value: "-" },
  { label: `${t("yes")}`, value: "ano" },
  { label: `${t("no")}`, value: "0" },
  { label: `${t("measurement_rejected")}`, value: "7" },
  { label: `${t("THC")}`, value: "1" },
  { label: `${t("AMP")}`, value: "2" },
  { label: `${t("MET")}`, value: "3" },
  { label: `${t("OP")}`, value: "4" },
  { label: `${t("BZD")}`, value: "5" },
  { label: `${t("others")}`, value: "6" },
  { label: `${t("not_detected")}`, value: "8" },
];

// Options for filtering pedestrian participation in accident
export const pedestrianOptions = (t: (key: string) => string) => [
  { label: "-", value: "-" },
  { label: `${t("yes")}`, value: "1" },
  { label: `${t("no")}`, value: "0" },
];

// Options for filtering fatal accidents (based on p13a)
export const consequenceOptions = (t: (key: string) => string) => [
  { label: "-", value: "-" },
  { label: `${t("yes")}`, value: "1" },
  { label: `${t("no")}`, value: "0" },
];

// Options for choosing between normal marker view and heatmap
export const viewOptions = (t: (key: string) => string) => [
  { label: `${t("normal")}`, value: `${t("normal")}` },
  { label: `${t("heatmap")}`, value: `${t("heatmap")}` },
];

// Options for filtering radars by operational status
export const activeRadarOptions = (t: (key: string) => string) => [
  { label: "-", value: "-" },
  { label: `${t("yes")}`, value: "1" },
  { label: `${t("no")}`, value: "0" },
];

// Options for showing radar measurement heatmap
export const measureViewOptions = (t: (key: string) => string) => [
  { label: `${t("yes")}`, value: `${t("yes")}` },
  { label: `${t("no")}`, value: `${t("no")}` },
];
