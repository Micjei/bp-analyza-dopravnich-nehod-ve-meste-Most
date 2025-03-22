import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import cz from "./locales/cz.json";
import en from "./locales/en.json";

i18n
  .use(LanguageDetector) // Automatická detekce jazyka
  .use(initReactI18next)
  .init({
    resources: {
      cz: { translation: cz },
      en: { translation: en },
    },
    fallbackLng: "cz", // Výchozí jazyk, pokud není detekován
    interpolation: { escapeValue: false },
  });

export default i18n;
