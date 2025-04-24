"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "@/i18n";
import { HelpCircle } from "lucide-react";

export default function InfoPage() {
  const { t } = useTranslation();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;
  return (
    <main className="mt-24 px-6 py-10 max-w-4xl mx-auto text-lg">
      <h1 className="text-3xl font-bold mb-6">{t("info_page_title")}</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">
          🧭 {t("header_section")}
        </h2>
        <p>{t("header_section_text")}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">🗺️ {t("map_section")}</h2>
        <p>{t("map_section_text")}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">
          🎛️ {t("filter_section")}
        </h2>
        <p>{t("filter_section_text")}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">
          🧾 {t("legend_section")}
        </h2>
        <p>{t("legend_section_text")}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">📊 {t("stats_section")}</h2>
        <p>{t("stats_section_text")}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl mb-2 font-semibold flex items-center">
          <span className="rounded-full ml-1 mr-3 flex items-center justify-center">
            <HelpCircle size={24} />
          </span>
          {t("help_section")}
        </h2>
        <p>{t("help_section_text")}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">
          📌 {t("footer_section")}
        </h2>
        <p>{t("footer_section_text")}</p>
      </section>
    </main>
  );
}
