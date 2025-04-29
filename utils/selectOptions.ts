// vyber roku/mesice/dnu
export const getCurrentYear = () => new Date().getFullYear();
export const years = Array.from(
  { length: getCurrentYear() - 2020 },
  (_, i) => 2021 + i
);

// přestupný rok
export const isLeapYear = (year: number) => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

// Funkce pro získání počtu dní v měsíci
export const getDaysInMonth = (month: number, year: number) => {
  const daysInMonth = [
    31, // Leden
    28 + (isLeapYear(year) ? 1 : 0), // Únor (28 nebo 29 dní)
    31, // Březen
    30, // Duben
    31, // Květen
    30, // Červen
    31, // Červenec
    31, // Srpen
    30, // Září
    31, // Říjen
    30, // Listopad
    31, // Prosinec
  ];

  return daysInMonth[month - 1];
};

export const alcoholOptions = (t: (key: string) => string) => [
  { label: "-", value: "-" },
  { label: `${t("yes")}`, value: "ano" },
  { label: `${t("no")}`, value: "2" },
  { label: `${t("measurement_rejected")}`, value: "4" },
  { label: `${t("from")} 0,24 ‰`, value: "1" },
  { label: `${t("from")} 0,24 ${t("to")} 0,5 ‰`, value: "3" },
  //{ label: "", value: "5" },
  { label: `${t("from")} 0,5 ${t("to")} 0,8 ‰`, value: "6" },
  { label: `${t("from")} 0,8 ${t("to")} 1,0 ‰`, value: "7" },
  { label: `${t("from")} 1,0 ${t("to")} 1,5 ‰`, value: "8" },
  { label: `1,5 ‰ ${t("and_more")}`, value: "9" },
  { label: `${t("not_detected")}`, value: "0" },
];

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

export const pedestrianOptions = (t: (key: string) => string) => [
  { label: "-", value: "-" },
  { label: `${t("yes")}`, value: `${t("yes")}` },
  { label: `${t("no")}`, value: `${t("no")}` },
];

export const consequenceOptions = (t: (key: string) => string) => [
  { label: "-", value: "-" },
  { label: `${t("yes")}`, value: "1" },
  { label: `${t("no")}`, value: "0" },
];

export const viewOptions = (t: (key: string) => string) => [
  { label: `${t("normal")}`, value: `${t("normal")}` },
  { label: `${t("heatmap")}`, value: `${t("heatmap")}` },
];

export const activeRadarOptions = (t: (key: string) => string) => [
  { label: "-", value: "-" },
  { label: `${t("yes")}`, value: `${t("yes")}` },
  { label: `${t("no")}`, value: `${t("no")}` },
];

export const measureViewOptions = (t: (key: string) => string) => [
  { label: `${t("yes")}`, value: `${t("yes")}` },
  { label: `${t("no")}`, value: `${t("no")}` },
];
