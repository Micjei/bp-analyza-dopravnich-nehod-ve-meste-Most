// vyber roku/mesice/dnu
export const getCurrentYear = () => new Date().getFullYear();
export const years = Array.from(
  { length: getCurrentYear() - 2014 },
  (_, i) => 2015 + i
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

export const alcoholOptions = [
  { label: "-", value: "-" },
  { label: "ne", value: "2" },
  { label: "měření odmítnuto", value: "4" },
  { label: "do 0,24 ‰", value: "1" },
  { label: "od 0,24 do 0,5 ‰", value: "3" },
  //{ label: "", value: "5" },
  { label: "od 0,5 do 0,8 ‰", value: "6" },
  { label: "od 0,8 do 1,0 ‰", value: "7" },
  { label: "od 1,0 do 1,5 ‰", value: "8" },
  { label: "1,5 ‰ a více", value: "9" },
  { label: "nezjišťováno", value: "0" },
];

export const drugsOptions = [
  { label: "-", value: "-" },
  { label: "ne", value: "0" },
  { label: "měření odmítnuto", value: "7" },
  { label: "THC (tetrahydrokanabinol)", value: "1" },
  { label: "AMP (amfetamin)", value: "2" },
  { label: "MET (metamfetamin)", value: "3" },
  { label: "OPI (opiáty)", value: "4" },
  { label: "benzodiazepin", value: "5" },
  { label: "jiné", value: "6" },
  { label: "nezjišťováno", value: "8" },
];

export const pedestrianOptions = [
  { label: "-", value: "-" },
  { label: "ano", value: "ano" },
  { label: "ne", value: "ne" },
];

export const consequenceOptions = [
  { label: "-", value: "-" },
  { label: "ano", value: "1" },
  { label: "ne", value: "0" },
];
