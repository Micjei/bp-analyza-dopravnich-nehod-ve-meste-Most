import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

export const fetchRadarsData = async () => {
  try {
    // Načtení měření a seskupení podle ID_LOKALITY
    const measurementsSnapshot = await getDocs(collection(db, "mereni"));
    const measurementsMap = new Map();

    measurementsSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const idLokalita = data.ID_LOKALITY;

      if (!measurementsMap.has(idLokalita)) {
        measurementsMap.set(idLokalita, []);
      }

      measurementsMap.get(idLokalita).push({
        prekroceni_rychlost_soucet:
          data.PREKROCENI_RYCHL_SOUCET || "nezjištěno", // edit
        datum: data.OBDOBI_FORMATOVANE || "nezjištěno", // edit
        prekroceni_ve_smeru: data.PREKROCENI_RYCHL_VE_SMERU || "nezjištěno", // edit
      });
    });

    // Načtení radarů a propojení s měřeními
    const radarsSnapshot = await getDocs(collection(db, "radary"));
    const features = radarsSnapshot.docs.map((doc) => {
      const data = doc.data();
      const measurementsData = measurementsMap.get(data.ID) || []; // Získá odpovídající měření podle ID_LOKALITY

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
          id: data.ID,
          lokalita: data.lokalita,
          smer: data.smer,
          v_provozu: data.v_provozu === 1 ? "Ano" : "Ne",
          mereni: measurementsData, // Pole měření pro daný radar
        },
      };
    });

    return {
      type: "FeatureCollection",
      features: features,
    };
  } catch (error) {
    console.error("Chyba při načítání dat radarů:", error);
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
      const kategorie = data.kategorie_chodce;
      const nasledky_chodci = data.nasledky;

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
      const nasledky_vozidlo = data.nasledky;

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
          drogy: data.drogy_u_vinika || "neznámé",
          chodci: pedestriansData, // Pole chodců
          nasledky_ve_vozidle: consequencesData, // Pole následků
          smrt: data.usmrceno_osob,
          tezce_zraneno_osob: data.tezce_zraneno_osob,
          lehce_zraneno_osob: data.lehce_zraneno_osob,
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
