"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface MapLayerContextType {
  tileLayerUrl: string;
  setTileLayerUrl: (url: string) => void;
}

const MapLayerContext = createContext<MapLayerContextType | undefined>(
  undefined
);

export const MapLayerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const apiKey = process.env.NEXT_PUBLIC_STADIA_MAPS_API_KEY;
  const [tileLayerUrl, setTileLayerUrl] = useState(
    `https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?key=${apiKey}`
  );

  return (
    <MapLayerContext.Provider value={{ tileLayerUrl, setTileLayerUrl }}>
      {children}
    </MapLayerContext.Provider>
  );
};

export const useMapLayer = (): MapLayerContextType => {
  const context = useContext(MapLayerContext);
  if (!context) {
    throw new Error("useMapLayer must be used within a MapLayerProvider");
  }
  return context;
};
