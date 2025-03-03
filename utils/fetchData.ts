import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

type CategoryOfPedestrian = 1 | 2 | 3 | 4 | 5;
type CategoryOfConsequence = 1 | 2 | 3 | 4;

const categoryOfPedestrian = {
  1: "muž",
  2: "žena",
  3: "dítě (do 15 let)",
  4: "skupina dětí",
  5: "jiná skupina",
};

// Mapování pro následky
const categoryOfConsequence = {
  1: "usmrcení",
  2: "těžké zranění",
  3: "lehké zranění",
  4: "bez zranění",
};
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
          v_provozu: data.v_provozu === 1 ? "Ano" : "Ne",
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

export const fetchAccidentsData = async () => {
  try {
    // Načtení chodců do mapy (seskupení podle ID nehody)
    const pedestriansSnapshot = await getDocs(collection(db, "chodci"));
    const pedestriansMap = new Map();

    pedestriansSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const kategorie =
        data.kategorie_chodce === null
          ? "neznámé"
          : categoryOfPedestrian[
              Number(data.kategorie_chodce) as CategoryOfPedestrian
            ];
      const nasledky_chodci =
        data.nasledky === null
          ? "neznámé"
          : categoryOfConsequence[
              Number(data.nasledky) as CategoryOfConsequence
            ];

      if (!pedestriansMap.has(data.ID)) {
        pedestriansMap.set(data.ID, []);
      }
      pedestriansMap.get(data.ID).push({
        kategorie: kategorie,
        vek: data.vek,
        nasledky_chodci: nasledky_chodci,
      });
    });

    // Načtení následků do mapy (seskupení podle ID nehody)
    const consequencesSnapshot = await getDocs(collection(db, "nasledky"));
    const consequencesMap = new Map();

    consequencesSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const nasledky_vozidlo =
        data.nasledky === null
          ? "neznámé"
          : categoryOfConsequence[
              Number(data.nasledky) as CategoryOfConsequence
            ];

      if (!consequencesMap.has(data.ID)) {
        consequencesMap.set(data.ID, []);
      }
      consequencesMap.get(data.ID).push({
        nasledky_vozidlo: nasledky_vozidlo,
      });
    });

    // Načtení nehod a propojení s chodci i následky
    const accidentsSnapshot = await getDocs(collection(db, "nehody"));
    const features = accidentsSnapshot.docs.map((doc) => {
      const data = doc.data();
      const pedestriansData = pedestriansMap.get(data.ID) || [];
      const consequencesData = consequencesMap.get(data.ID) || [];

      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [data.souradnice.longitude, data.souradnice.latitude],
        },
        properties: {
          id: data.ID,
          datum: data.datum,
          alkohol: data.alkohol_u_vinika || "neznámé",
          chodci: pedestriansData, // Pole chodců
          nasledky_ve_vozidle: consequencesData, // Pole následků
        },
      };
    });

    return {
      type: "FeatureCollection",
      features: features,
    };
  } catch (error) {
    console.error("Chyba při načítání dat:", error);
    return null;
  }
};
