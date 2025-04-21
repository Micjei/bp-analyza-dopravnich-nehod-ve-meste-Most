"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import "@/i18n";
import { HelpCircle } from "lucide-react";

export default function InfoPage() {
  const { t } = useTranslation();

  return (
    <main className=" mt-24 px-6 py-10 max-w-4xl mx-auto text-lg ">
      <h1 className="text-3xl font-bold mb-6">{t("info_page_title")}</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">🗺️ {t("map_section")}</h2>
        <p>
          Interaktivní mapa zobrazuje lokality s radary a dopravní nehody.
          Kliknutím na symbol nebo oblast se zobrazí podrobnosti. Můžete
          přepínat mezi světlým a tmavým režimem nebo změnit podkladovou mapu
          (satelitní, OpenStreetMap apod.).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">
          📊 {t("dashboard_section")}
        </h2>
        <p>
          Stránka s grafy umožňuje porovnávat data z různých časových období.
          Můžete zobrazit například četnost překročení rychlosti nebo podíl
          různých následků dopravních nehod.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">
          🔘 {t("filter_section")}
        </h2>
        <p>
          Pomocí výběrových boxů (rok, měsíc, den, alkohol, účast chodce apod.)
          lze upravit zobrazená data podle specifických kritérií. To umožňuje
          detailnější analýzu konkrétních situací a přesnější vizualizaci.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">
          ⚙️ {t("settings_section")}
        </h2>
        <p>
          V pravé horní části aplikace se nachází nabídka pro změnu jazykové
          mutace a přepnutí mezi světlým a tmavým režimem. Tím si můžete
          přizpůsobit prostředí aplikace podle vlastních preferencí.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl mb-2 font-semibold flex items-center">
          <span className="rounded-full ml-1 mr-3 flex items-center justify-center">
            <HelpCircle size={24} />
          </span>
          {t("help_section")}
        </h2>

        <p>
          Pokud máte zájem o podrobnější informace o tom, odkud data pochází a
          jak jsou zpracovávána, navštivte dokumentaci nebo kontaktujte správce
          aplikace.
        </p>
      </section>
    </main>
  );
}
