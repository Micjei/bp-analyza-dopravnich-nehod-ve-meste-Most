import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

export const fetchRadarsData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "radary"));
    const features = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [
            data.geometry.coordinates[0],
            data.geometry.coordinates[1],
          ],
        },
        properties: {
          lokalita: data.lokalita,
          smer: data.smer,
          v_provozu: data.v_provozu,
        },
      };
    });

    return {
      type: "FeatureCollection",
      features: features,
    };
  } catch (error) {
    console.error("Chyba při načítání radary dat:", error);
    return null;
  }
};

// přidat nějaký filter podle roku a podobne ****
export const fetchAccidentsData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "nehody"));
    const features = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [data.souradnice.longitude, data.souradnice.latitude],
        },
      };
    });

    return {
      type: "FeatureCollection",
      features: features,
    };
  } catch (error) {
    console.error("Chyba při načítání nehody dat:", error);
    return null;
  }
};

// smazat
export const fetchOtherGeoJsonData = async () => {
  try {
    const response = await fetch("data/otherData.geojson");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Chyba při načítání jiných dat GeoJSON:", error);
    return null;
  }
};
