import React, { useState } from "react";

interface HeaderProps {
  headerText: string;
  onLayerChange: (url: string) => void;
  onSettingsClick?: () => void;
}

const HeaderSection: React.FC<HeaderProps> = ({
  headerText,
  onLayerChange,
  onSettingsClick,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const mapLayers = [
    {
      name: "Satelitní",
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
    <div className="absolute top-0 w-full flex flex-row items-center justify-between p-5 bg-[#66BB6A] border-2 border-[#66BB6A] shadow-md text-[#ffffff] opacity-80 whitespace-nowrap">
      <h3 className="transition-opacity duration-300 text-3xl font-bold tracking-wide italic">
        {headerText}
      </h3>

      <div className="flex flex-row items-center space-x-2">
        {/* Tlačítko pro výběr mapy */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="bg-transparent text-[#ffffff] px-4 py-2 rounded-md shadow-md hover:bg-gray-200 hover:text-[#388E3C]"
          >
            Vybrat mapu
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
          Nastavení
        </button>
      </div>
    </div>
  );
};

export default HeaderSection;
