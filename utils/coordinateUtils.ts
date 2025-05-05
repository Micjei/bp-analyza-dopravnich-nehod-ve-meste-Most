import proj4 from "proj4";

// Define the EPSG:5514 coordinate system (Krovak projection used in the Czech Republic)
proj4.defs(
  "EPSG:5514",
  "+proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=570.69,85.69,462.84,4.998,1.586,5.261,3.56 +units=m +no_defs"
);

/**
 * Converts coordinates from EPSG:5514 (Krovak) to EPSG:4326 (WGS84 - latitude/longitude).
 * @param x - X coordinate in meters (East)
 * @param y - Y coordinate in meters (North)
 * @returns Object containing latitude and longitude in decimal degrees.
 */
export const convertCoordinates = (x: number, y: number) => {
  const [longitude, latitude] = proj4("EPSG:5514", "EPSG:4326", [x, y]);
  return { latitude, longitude };
};
