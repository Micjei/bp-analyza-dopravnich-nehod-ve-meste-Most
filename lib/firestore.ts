import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { convertCoordinates } from "../utils/coordinateUtils";

// Uložení radaru do Firestore
export const saveRadarsGeoJSON = async (geojson: any) => {
  try {
    const radaryRef = collection(db, "radary");

    for (const feature of geojson.features) {
      await addDoc(radaryRef, {
        ID: feature.properties.ID,
        lokalita: feature.properties.LOKALITA,
        v_provozu: feature.properties.V_PROVOZU,
        smer: feature.properties.SMER,
        gps: feature.properties.GPS,
        geometry: feature.geometry,
      });
    }

    console.log("✅ Všechna data byla uložena do Firestore!");
  } catch (error) {
    console.error("❌ Chyba při ukládání do Firestore:", error);
  }
};

// Uložení nehod do Firestore
export const saveAccidentsGeoJSON = async (geojson: any) => {
  try {
    const accidentsRef = collection(db, "nehody");

    for (const feature of geojson.features) {
      // Převod souřadnic z EPSG:5514 na CRS84
      const { latitude, longitude } = convertCoordinates(
        feature.geometry.coordinates[0],
        feature.geometry.coordinates[1]
      );

      await addDoc(accidentsRef, {
        ID: feature.properties.p1, // id nehody
        datum: feature.properties.p2a, // den, mesic, rok
        cas: feature.properties.p2b, // cas
        lokalita_nehody: feature.properties.p5a, // lokalita nehody 1 v obci 2 mimo obec
        druh_nehody: feature.properties.p6, // druh nehody
        druh_srazky: feature.properties.p7, // druh srazky s jedoucim vozidlem
        druh_pevne_prekazky: feature.properties.p8, // druh pevne prekazky
        druh_zvirete: feature.properties.p8a, // druh zvirete
        charakter_nehody: feature.properties.p9, // charakter nehody
        zavineni_nehody: feature.properties.p10, // zavineni nehody
        alkohol_u_vinika: feature.properties.p11, // alkohol u vinika
        drogy_u_vinika: feature.properties.p11a, // drogy u vinika nehody
        hlavni_priciny_nehody: feature.properties.p12, // hlavni priciny nehody
        usmrceno_osob: feature.properties.p13a, // usmrceno osob
        tezce_zraneno_osob: feature.properties.p13b, // tezce zraneno osob
        lehce_zraneno_osob: feature.properties.p13c, // lehce zraneno osob
        celkova_hmotna_skoda: feature.properties.p14, // celkova hmotna skoda v kc
        druh_povrchu_vozovky: feature.properties.p15, // druh povrchu vozovky
        stav_povrchu_vozovky: feature.properties.p16, // stav povrchu vozovky v dobe nehody
        stav_komunikace: feature.properties.p17, // stav komunikace
        povetrnostni_podminky: feature.properties.p18, // povetrnostni podminky
        viditelnost: feature.properties.p19, // viditelnost
        rozhledove_pomery: feature.properties.p20, // rozhledove pomery
        deleni_komunikace: feature.properties.p21, // deleni komunikace
        situovani_nehody: feature.properties.p22, // situovani nehody na komunikaci
        rizeni_provozu: feature.properties.p23, // rizeni provozu v dobe nehody
        mistni_uprava_v_prednosti: feature.properties.p24, // mistni uprava v prednosti v jizde
        specificka_mista_objekty: feature.properties.p27, // specificka mista a objekty v miste nehody
        smerove_pomery: feature.properties.p28, // smerove pomery
        pocet_zucastnenich_vozidel: feature.properties.p34, // pocet zucastnenich vozidel
        misto_dopravni_nehody: feature.properties.p35, // misto dopravni nehody
        druh_pozemni_komunikace: feature.properties.p36, // druh pozemni komunikace
        cislo_pozemni_komunikace: feature.properties.p37, // cislo pozemni komunikace
        druh_krizujici_komunikace: feature.properties.p39, // druh krizujici komunikace
        souradnice: {
          latitude,
          longitude,
        },
      });
    }

    console.log("✅ Všechna data byla uložena do Firestore!");
  } catch (error) {
    console.error("❌ Chyba při ukládání do Firestore:", error);
  }
};

// Uložení vozidel do Firestore
export const saveVehiclesGeoJSON = async (geojson: any) => {
  try {
    const vehicleRef = collection(db, "vozidla");

    for (const feature of geojson.features) {
      await addDoc(vehicleRef, {
        ID: feature.properties.p1, // ID vozidla
        druh_vozidla: feature.properties.p44, // Druh vozidla
        znacka_vozidla: feature.properties.p45a, // Výrobní značka motorového vozidla
        udaje_o_vozidle: feature.properties.p45b, // Údaje o vozidle
        druh_pohonu: feature.properties.p45d, // Druh pohonu / paliva
        druh_pneumatik: feature.properties.p45f, // Druh pneumatik na vozidle
        rok_vyroby: feature.properties.p47, // Rok výroby vozidla
        charakteristika_vozidla: feature.properties.p48a, // Charakteristika vozidla
        nezname_udaje: feature.properties.p48b, // -------- idk co to je
        smyk: feature.properties.p49, // Smyk
        stav_vozidla_po_nehode: feature.properties.p50a, // Vozidlo po nehodě
        unik_kapalin: feature.properties.p50b, // Únik provozních, přepravovaných hmot
        vyprosteni_osob: feature.properties.p51, // Způsob vyproštění osob z vozidla
        smer_jizdy: feature.properties.p52, // Směr jízdy nebo postavení vozidla
        skoda_na_vozidle: feature.properties.p53, // Škoda na vozidle ve stokorunách
        kategorie_ridice: feature.properties.p55a, // Kategorie řidiče
        stav_ridice: feature.properties.p57, // Stav řidiče
        vnejsi_ovlivneni_ridice: feature.properties.p58, // Vnější ovlivnění řidiče
      });
    }

    console.log("✅ Všechna data byla uložena do Firestore!");
  } catch (error) {
    console.error("❌ Chyba při ukládání do Firestore:", error);
  }
};

// Uložení chodců do Firestore
export const savePedestriansGeoJSON = async (geojson: any) => {
  try {
    const pedestriansRef = collection(db, "chodci");

    for (const feature of geojson.features) {
      await addDoc(pedestriansRef, {
        ID: feature.properties.p1, // ID chodce
        kategorie_chodce: feature.properties.p29, // Kategorie chodce
        stav_chodce: feature.properties.p30, // Stav chodce
        chovani_chodce: feature.properties.p31, // Chování chodce
        situace_v_miste_nehody: feature.properties.p32, // Situace v místě nehody
        reflexni_prvky: feature.properties.p29a, // Reflexní prvky u chodce
        chodec_na_prepravniku: feature.properties.p29b, // Chodec na osobním přepravníku
        alkohol_u_chodce: feature.properties.p30a, // Alkohol u chodce přítomen
        druh_drogy: feature.properties.p30b, // Druh drogy u chodce
        pohlavi: feature.properties.p33c, // Pohlaví osoby
        vek: feature.properties.p33d, // Věk chodce
        statni_prislusnost: feature.properties.p33e, // Státní příslušnost
        prvni_pomoc: feature.properties.p33f, // Poskytnutí první pomoci
        nasledky: feature.properties.p33g, // Následky chodce
      });
    }

    console.log("✅ Všechna data byla uložena do Firestore!");
  } catch (error) {
    console.error("❌ Chyba při ukládání do Firestore:", error);
  }
};

// Uložení nasledků do Firestore
export const saveConsequencesGeoJSON = async (geojson: any) => {
  try {
    const consequencesRef = collection(db, "nasledky");

    for (const feature of geojson.features) {
      await addDoc(consequencesRef, {
        ID: feature.properties.p1,
        oznaceni_osoby: feature.properties.p59a,
        blizsi_oznaceni_osoby: feature.properties.p59b,
        pohlavi: feature.properties.p59c,
        vek: feature.properties.p59d,
        statni_prislusnost: feature.properties.p59e,
        prvni_pomoc: feature.properties.p59f,
        nasledky: feature.properties.p59g,
      });
    }

    console.log("✅ Všechna data byla uložena do Firestore!");
  } catch (error) {
    console.error("❌ Chyba při ukládání do Firestore:", error);
  }
};
