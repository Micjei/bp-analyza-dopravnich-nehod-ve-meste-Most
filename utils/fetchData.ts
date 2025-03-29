import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

export const fetchRadarsData = async () => {
  try {
    // Fetch dat z našeho backendu
    const response = await fetch("/api/downloadRadars");

    if (!response.ok) {
      throw new Error("Nepodařilo se načíst data z backendu.");
    }

    const { measurements, radars } = await response.json();

    // Seskupení měření podle ID_LOKALITY
    const measurementsMap = new Map();
    measurements.features.forEach((feature: any) => {
      const data = feature.properties;
      const idLokalita = data.ID_LOKALITY;

      if (!measurementsMap.has(idLokalita)) {
        measurementsMap.set(idLokalita, []);
      }

      measurementsMap.get(idLokalita).push({
        prekroceni_rychl_ve_smeru:
          data.PREKROCENI_RYCHL_VE_SMERU || "nezjištěno",
        datum: data.OBDOBI_FORMATOVANE || "nezjištěno",
        datum_text: data.DEN_TEXT || "nezjištěno",
        prekroceni_rychl_v_protismeru:
          data.PREKROCENI_RYCHL_V_PROTISMERU || "nezjištěno",
        prekroceni_rychl_soucet: data.PREKROCENI_RYCHL_SOUCET || "nezjištěno",
      });
    });

    // Propojení radarů s měřeními
    const features = radars.features.map((feature: any) => {
      const data = feature.properties;
      const measurements = measurementsMap.get(data.ID) || [];

      return {
        type: "Feature",
        geometry: feature.geometry,
        properties: {
          id: data.ID,
          lokalita: data.LOKALITA,
          smer: data.SMER,
          v_provozu: data.V_PROVOZU === 1 ? "Ano" : "Ne",
          mereni: measurements,
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
