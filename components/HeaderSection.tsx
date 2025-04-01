"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import "@/i18n";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeContext";

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
      url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    },
    {
      name: "Carto Light",
      url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
    },
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  let linkHref = "/diagrams";
  let pageButton = "Zobrazit grafy";
  if (currentPath === "/diagrams") {
    linkHref = "/";
    pageButton = "Zobrazit mapu";
  }

  return (
    <div className="absolute top-0 w-full h-20 flex flex-row items-center justify-between p-5 bg-header-bg border-2 border-header-border shadow-md text-header-text opacity-80 whitespace-nowrap">
      <h3 className="transition-opacity duration-300 text-3xl font-bold tracking-wide italic">
        {`${t("title")}`}
      </h3>

      <div className="flex flex-row items-center space-x-2 gap-2">
        {/* Jazykové přepínače */}
        <div className="ml-4 flex flex-row gap-2">
          <button onClick={() => i18n.changeLanguage("cz")}>
            <img src="/czech-republic.png" className="w-14 h-auto" />
          </button>
          <button onClick={() => i18n.changeLanguage("en")}>
            <img src="/united-kingdom.png" className="w-14 h-auto" />
          </button>
        </div>

        {/* Výběr mapy */}
        {onLayerChange && (
          <div className="relative">
            <button
              onClick={() => setShowMapDropdown(!showMapDropdown)}
              className="bg-transparent text-header-text px-4 py-2 rounded-md shadow-md hover:bg-header-bg-hover hover:text-header-text-hover"
            >
              {t("select_map")}
            </button>

            {showMapDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-dropdown-bg border border-dropdown-border rounded-md shadow-lg text-dropdown-text z-50">
                {mapLayers.map((layer) => (
                  <button
                    key={layer.url}
                    onClick={() => {
                      onLayerChange(layer.url);
                      setShowMapDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-dropdown-bg-hover"
                  >
                    {layer.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Odkaz na druhou stránku */}
        <Link href={linkHref}>
          <button className="bg-transparent text-header-text px-4 py-2 rounded-md shadow-md hover:bg-header-bg-hover hover:text-header-text-hover">
            {pageButton}
          </button>
        </Link>

        {/* Nastavení + přepínač tématu */}
        <div className="relative">
          <button
            onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
            className="bg-transparent text-header-text px-4 py-2 rounded-md shadow-md hover:bg-header-bg-hover hover:text-header-text-hover"
          >
            {t("settings")}
          </button>

          {showSettingsDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-dropdown-bg border border-dropdown-border rounded-md shadow-lg text-dropdown-text z-50">
              <button
                onClick={toggleTheme}
                className="block w-full text-left px-4 py-2 hover:bg-dropdown-bg-hover"
              >
                {isDark ? "☀️ Světlý režim" : "🌙 Tmavý režim"}
              </button>
              {/* Další nastavení može byt */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderSection;
