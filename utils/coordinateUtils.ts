import proj4 from "proj4";

// Definice souřadnicových systémů
proj4.defs(
  "EPSG:5514",
  "+proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=570.69,85.69,462.84,4.998,1.586,5.261,3.56 +units=m +no_defs"
);

// Funkce pro převod souřadnic
export const convertCoordinates = (x: number, y: number) => {
  // Provedeme převod z EPSG:5514 na EPSG:4326 (geografické souřadnice)
  const [longitude, latitude] = proj4("EPSG:5514", "EPSG:4326", [x, y]);
  return { latitude, longitude };
};
