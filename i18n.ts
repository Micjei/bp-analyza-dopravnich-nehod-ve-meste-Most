import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import cz from "./locales/cz.json";
import en from "./locales/en.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      cs: { translation: cz },
      en: { translation: en },
    },
    fallbackLng: "cs",
    interpolation: { escapeValue: false },
  });

export default i18n;
