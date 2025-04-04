import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { convertCoordinates } from "../utils/coordinateUtils";

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
        rychlostni_limit: data.RYCHLOSTNI_LIMIT,
        r30_40_ve_smeru: data.R30_40_VE_SMERU,
        r30_40_v_protismeru: data.R30_40_V_PROTISMERU,
        r30_40_soucet: data.R30_40_SOUCET,
        r40_50_ve_smeru: data.R40_50_VE_SMERU,
        r40_50_v_protismeru: data.R40_50_V_PROTISMERU,
        r40_50_soucet: data.R40_50_SOUCET,
        r50_60_ve_smeru: data.R50_60_VE_SMERU,
        r50_60_v_protismeru: data.R50_60_V_PROTISMERU,
        r50_60_soucet: data.R50_60_SOUCET,
        r60_70_ve_smeru: data.R60_70_VE_SMERU,
        r60_70_v_protismeru: data.R60_70_V_PROTISMERU,
        r60_70_soucet: data.R60_70_SOUCET,
        r70_80_ve_smeru: data.R70_80_VE_SMERU,
        r70_80_v_protismeru: data.R70_80_V_PROTISMERU,
        r70_80_soucet: data.R70_80_SOUCET,
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
    const response = await fetch("/api/downloadAccidents");

    if (!response.ok) {
      throw new Error("Nepodařilo se načíst data z backendu.");
    }

    const { vehicles, accidents, consequences, pedestrians } =
      await response.json();

    // Mapování chodců podle ID nehody
    const pedestriansMap = new Map();
    pedestrians.features.forEach((feature: any) => {
      const data = feature.properties;
      const accidentId = data.p1;

      if (!pedestriansMap.has(accidentId)) {
        pedestriansMap.set(accidentId, []);
      }

      pedestriansMap.get(accidentId).push({
        kategorie: data.p29 || "neznámé", //kategorie_chodce || "neznámé",
        vek: data.p33d || "neznámé", // vek || "neznámé",
        nasledky_chodci: data.p33g || "neznámé", // nasledky || "neznámé",
      });
    });

    // Mapování následků podle ID nehody
    const consequencesMap = new Map();
    consequences.features.forEach((feature: any) => {
      const data = feature.properties;
      const accidentId = data.p1;

      if (!consequencesMap.has(accidentId)) {
        consequencesMap.set(accidentId, []);
      }

      consequencesMap.get(accidentId).push({
        nasledky_vozidlo: data.p59g || "neznámé", //nasledky || "neznámé",
      });
    });

    // Zpracování nehod
    const features = accidents.features.map((feature: any) => {
      const data = feature.properties;
      const chodci = pedestriansMap.get(data.p1) || [];
      const nasledky = consequencesMap.get(data.p1) || [];
      const [x, y] = feature.geometry.coordinates;
      const { latitude, longitude } = convertCoordinates(x, y);
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        properties: {
          id: data.p1,
          datum: data.p2a, //datum,
          alkohol: data.p11, //alkohol_u_vinika || "neznámé",
          drogy: data.p11a || "neznámé", //drogy_u_vinika || "neznámé",
          smrt: data.p13a || 0, //usmrceno_osob || 0,
          tezce_zraneno_osob: data.p13b || 0, //tezce_zraneno_osob || 0,
          lehce_zraneno_osob: data.p13c || 0, //lehce_zraneno_osob || 0,
          chodci,
          nasledky_ve_vozidle: nasledky,
        },
      };
    });

    const result = {
      type: "FeatureCollection",
      features,
    };

    // ✅ Výpis až po načtení a zpracování všech dat
    console.log("✅ Data o nehodách byla úspěšně načtena a zpracována:");
    console.log("Celkový počet nehod:", result.features.length);
    console.log("Ukázka nehody:", result.features[0]);

    return result;
  } catch (error) {
    console.error("Chyba při načítání dat nehod:", error);
    return null;
  }
};

// pro jistotu
/*export const fetchAccidentsData = async () => {
  try {
    // Načtení chodců do mapy (seskupení podle ID nehody)
    const pedestriansSnapshot = await getDocs(collection(db, "chodci"));
    const pedestriansMap = new Map();

    pedestriansSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const kategorie = data.kategorie_chodce; // p29
      const nasledky_chodci = data.nasledky; // p33g

      if (!pedestriansMap.has(data.ID)) {
        pedestriansMap.set(data.ID, []);
      }
      pedestriansMap.get(data.ID).push({
        kategorie: kategorie, // p29
        vek: data.vek, // p33d
        nasledky_chodci: nasledky_chodci, // p33g
      });
    });

    // Načtení následků do mapy (seskupení podle ID nehody)
    const consequencesSnapshot = await getDocs(collection(db, "nasledky"));
    const consequencesMap = new Map();

    consequencesSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const nasledky_vozidlo = data.nasledky; // p59g

      if (!consequencesMap.has(data.ID)) {
        consequencesMap.set(data.ID, []);
      }
      consequencesMap.get(data.ID).push({
        nasledky_vozidlo: nasledky_vozidlo, // p59g
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
};*/
