import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "@/i18n"; // Import konfigurace i18n
interface HeaderProps {
  onLayerChange: (url: string) => void;
  onSettingsClick?: () => void;
}

const HeaderSection: React.FC<HeaderProps> = ({
  onLayerChange,
  onSettingsClick,
}) => {
  const { t, i18n } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);

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

  return (
    <div className="absolute top-0 w-full h-20 flex flex-row items-center justify-between p-5 bg-[#66BB6A] border-2 border-[#66BB6A] shadow-md text-[#ffffff] opacity-80 whitespace-nowrap">
      <h3 className="transition-opacity duration-300 text-3xl font-bold tracking-wide italic">
        {`${t("title")}`}
      </h3>

      <div className="flex flex-row items-center space-x-2 gap-2">
        {/** vlajky - změna jazyka */}
        <div className="ml-4 flex flex-row gap-2">
          <button onClick={() => i18n.changeLanguage("cz")}>
            <img
              src="/czech-republic.png"
              className="w-14 h-auto transition-transform duration-700"
            />
          </button>
          <button onClick={() => i18n.changeLanguage("en")}>
            <img
              src="/united-kingdom.png"
              className="w-14 h-auto transition-transform duration-700"
            />
          </button>
        </div>
        {/* Tlačítko pro výběr mapy */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="bg-transparent text-[#ffffff] px-4 py-2 rounded-md shadow-md hover:bg-gray-200 hover:text-[#388E3C]"
          >
            {`${t("select_map")}`}
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg text-[#388E3C]">
              {mapLayers.map((layer) => (
                <button
                  key={layer.url}
                  onClick={() => {
                    onLayerChange(layer.url);
                    setShowDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  {layer.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tlačítko pro nastavení */}
        <button
          onClick={() => onSettingsClick && onSettingsClick()}
          className="bg-transparent text-[#ffffff] px-4 py-2 rounded-md shadow-md hover:bg-gray-200 hover:text-[#388E3C]"
        >
          {`${t("settings")}`}
        </button>
      </div>
    </div>
  );
};

export default HeaderSection;
