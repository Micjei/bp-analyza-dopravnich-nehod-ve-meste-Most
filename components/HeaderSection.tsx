import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import "@/i18n";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";

interface HeaderProps {
  onLayerChange?: (url: string) => void;
}

const HeaderSection: React.FC<HeaderProps> = ({ onLayerChange }) => {
  const { t, i18n } = useTranslation();
  const [showMapDropdown, setShowMapDropdown] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const currentPath = usePathname();
  const { isDark, toggleTheme } = useTheme();

  const mapLayers = [
    {
      name: `${t("satellite")}`,
      url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
    },
    {
      name: "OpenStreetMap",
      url: isDark
        ? "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        : "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    },
    {
      name: "Carto Light",
      url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
    },
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && !target.closest(".dropdown")) {
        setShowMapDropdown(false);
        setShowSettingsDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isClient) return null;

  const linkHref = currentPath === "/diagrams" ? "/" : "/diagrams";
  const pageButton = currentPath === "/diagrams" ? t("map") : t("stats");

  return (
    <div className="absolute top-0 w-full h-auto min-h-20 flex flex-wrap md:flex-nowrap items-center justify-between px-4 py-2 bg-header-bg border-2 border-header-border shadow-md text-header-text opacity-90 gap-2 z-[999]">
      <h3 className="w-full md:w-fit text-nowrap text-center md:text-left text-xl md:text-3xl font-bold tracking-wide italic">
        {t("title")}
      </h3>

      <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 flex-grow min-w-0">
        {/* Výběr mapy */}
        {onLayerChange && (
          <div className="relative dropdown">
            <button
              onClick={() => setShowMapDropdown(!showMapDropdown)}
              className="px-2 py-1 md:px-4 md:py-2 rounded-md shadow-md bg-transparent hover:bg-header-bg-hover hover:text-header-text-hover text-sm md:text-base"
            >
              {t("select_map")}
            </button>
            {showMapDropdown && (
              <div className="absolute right-0 mt-2 w-40 md:w-48 bg-dropdown-bg border border-dropdown-border rounded-md shadow-lg text-dropdown-text z-50">
                {mapLayers.map((layer) => (
                  <button
                    key={layer.url}
                    onClick={() => {
                      onLayerChange(layer.url);
                      setShowMapDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-dropdown-bg-hover text-sm"
                  >
                    {layer.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Přepínač stránky */}
        <Link href={linkHref}>
          <button className="px-2 py-1 md:px-4 md:py-2 rounded-md shadow-md bg-transparent hover:bg-header-bg-hover hover:text-header-text-hover text-sm md:text-base">
            {pageButton}
          </button>
        </Link>

        {/* Nastavení / Téma */}
        <div className="relative dropdown">
          <button
            onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
            className="px-2 py-1 md:px-4 md:py-2 rounded-md md:shadow-md bg-transparent md:hover:bg-header-bg-hover hover:text-header-text-hover text-sm md:text-base flex items-center justify-center"
          >
            {/* Ikona pro mobil */}
            <span className="md:hidden text-xl">⚙️</span>

            {/* Text pro desktop */}
            <span className="hidden md:block">{t("settings")}</span>
          </button>

          {showSettingsDropdown && (
            <div className="absolute right-0 mt-2 w-40 md:w-48 bg-dropdown-bg border border-dropdown-border rounded-md shadow-lg text-dropdown-text z-50">
              <button
                onClick={() => {
                  toggleTheme();
                  setShowSettingsDropdown(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-dropdown-bg-hover text-sm"
              >
                {isDark ? "☀️ Světlý režim" : "🌙 Tmavý režim"}
              </button>
            </div>
          )}
        </div>
        {/* Jazykové přepínače */}
        <div className="flex flex-row gap-1 md:gap-2">
          {i18n.language !== "cz" && (
            <button onClick={() => i18n.changeLanguage("cz")}>
              <img
                src="/czech-republic.png"
                className="w-8 md:w-10 h-auto"
                alt="CZ"
              />
            </button>
          )}
          {i18n.language !== "en" && (
            <button onClick={() => i18n.changeLanguage("en")}>
              <img
                src="/united-kingdom.png"
                className="w-8 md:w-10 h-auto"
                alt="EN"
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderSection;
