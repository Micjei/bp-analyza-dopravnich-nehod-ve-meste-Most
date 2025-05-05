"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function WelcomePopup() {
  const { t } = useTranslation();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("seenHelpPopup");
    if (!seen) {
      setShowPopup(true);
    }
  }, []);

  const handleGotIt = () => {
    setShowPopup(false);
    localStorage.setItem("seenHelpPopup", "true");
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-zinc-800 text-black dark:text-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-2">{t("welcome_title")}</h2>
        <p className="mb-4">⚠️{t("welcome_text")}</p>
        <button
          onClick={handleGotIt}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {t("got_it")}
        </button>
      </div>
    </div>
  );
}
