"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "@/i18n";
import { HelpCircle } from "lucide-react";

export default function InfoPage() {
  const { t } = useTranslation(); // Hook for translations

  const [isClient, setIsClient] = useState(false); // State to check if rendering on client

  useEffect(() => {
    // Ensures component only renders on the client (prevents hydration errors)
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <main className="mt-24 px-6 py-10 max-w-4xl mx-auto text-lg">
      {/* Page title */}
      <h1 className="text-3xl font-bold mb-6">{t("info_page_title")}</h1>

      {/* Section: Header */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">
          🧭 {t("header_section")}
        </h2>
        <p>{t("header_section_text")}</p>
      </section>

      <div className="w-[calc(100%+2.5rem)] -mx-5  border-b-2 border-filters-border mb-5 mt-2"></div>

      {/* Section: Map */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">🗺️ {t("map_section")}</h2>
        <p>{t("map_section_text")}</p>
      </section>

      {/* Section: Filters */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">
          🎛️ {t("filter_section")}
        </h2>
        <p>{t("filter_section_text")}</p>
      </section>

      {/* Section: Legend */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">
          🧾 {t("legend_section")}
        </h2>
        <p>{t("legend_section_text")}</p>
      </section>

      <div className="w-[calc(100%+2.5rem)] -mx-5  border-b-2 border-filters-border mb-5 mt-2"></div>

      {/* Section: Statistics */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">📊 {t("stats_section")}</h2>
        <p>{t("stats_section_text")}</p>
      </section>

      <div className="w-[calc(100%+2.5rem)] -mx-5  border-b-2 border-filters-border mb-5 mt-2"></div>

      {/* Section: Help */}
      <section className="mb-8">
        <h2 className="text-2xl mb-2 font-semibold flex items-center">
          <span className="rounded-full ml-1 mr-3 flex items-center justify-center">
            <HelpCircle size={24} />
          </span>
          {t("help_section")}
        </h2>
        <p>{t("help_section_text")}</p>
      </section>

      <div className="w-[calc(100%+2.5rem)] -mx-5  border-b-2 border-filters-border mb-5 mt-2"></div>

      {/* Section: Footer */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">
          📌 {t("footer_section")}
        </h2>
        <p>{t("footer_section_text")}</p>
      </section>
    </main>
  );
}
