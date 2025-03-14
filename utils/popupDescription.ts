export const getAlcoholDescription = (alcohol: string | number): string => {
  const alcoholMap: Record<string, string> = {
    "0": "nezjišťováno",
    "1": "0,01 - 0,24 ‰",
    "2": "ne",
    "3": "0,24 - 0,5 ‰",
    "4": "odmítnuto",
    //"5": "1,00 - 1,49 ‰",
    "6": "0,5 - 0,8 ‰",
    "7": "0,8 - 1,0 ‰",
    "8": "1,0 - 1,5 ‰",
    "9": "1,5 ‰ a více",
  };
  const parsedValue = parseInt(String(alcohol), 10);
  return alcoholMap[String(parsedValue)] || "Neznámá hodnota";
};

export const getDrugsDescription = (drug: string | number): string => {
  const drugMap: Record<string, string> = {
    "0": "ne",
    "1": "THC (tetrahydrokanabinol)",
    "2": "AMP (amfetamin)",
    "3": "MET (metamfetamin)",
    "4": "OPI (opiáty)",
    "5": "benzodiazepin",
    "6": "jiné",
    "7": "měření odmítnuto",
    "8": "nezjišťováno",
  };
  const parsedValue = parseInt(String(drug), 10);
  return drugMap[String(parsedValue)] || "Neznámá hodnota";
};
