"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the context type for managing map tile layer
interface MapLayerContextType {
  tileLayerUrl: string;
  setTileLayerUrl: (url: string) => void;
}

// Create the context with an undefined default value
const MapLayerContext = createContext<MapLayerContextType | undefined>(
  undefined
);

// Context provider component to wrap parts of the app that need map layer access
export const MapLayerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Default map tile URL using Stadia Maps dark theme
  const apiKey = process.env.NEXT_PUBLIC_STADIA_MAPS_API_KEY || "";
  const defaultUrl = `https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=${apiKey}`;

  // State for the current tile layer URL
  const [tileLayerUrl, setTileLayerUrl] = useState(defaultUrl);

  return (
    <MapLayerContext.Provider value={{ tileLayerUrl, setTileLayerUrl }}>
      {children}
    </MapLayerContext.Provider>
  );
};

// Custom hook to consume the map layer context
export const useMapLayer = (): MapLayerContextType => {
  const context = useContext(MapLayerContext);
  if (!context) {
    throw new Error("useMapLayer must be used within a MapLayerProvider");
  }
  return context;
};
