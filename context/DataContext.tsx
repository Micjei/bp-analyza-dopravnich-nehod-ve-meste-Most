"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { fetchRadarsData, fetchAccidentsData } from "@/utils/fetchData";

// Define the shape of data context
interface DataContextType {
  RadarsData: any;
  AccidentsData: any;
}

// Create a React context for sharing data across components
const DataContext = createContext<DataContextType | undefined>(undefined);

// Custom hook to consume the DataContext
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

// Provider component that fetches and provides radar and accident data
export const DataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // State to hold fetched data
  const [RadarsData, setRadarsData] = useState<any>(null);
  const [AccidentsData, setAccidentsData] = useState<any>(null);
  const [loading, setLoading] = useState(true); // Optional loading state

  useEffect(() => {
    // Load radar and accident data on mount
    const loadData = async () => {
      try {
        const radars = await fetchRadarsData(); // Fetch radar measurements
        setRadarsData(radars);

        const accidents = await fetchAccidentsData(); // Fetch accident data
        setAccidentsData(accidents);
      } catch (error) {
        console.error("Error loading data", error); // Handle fetch errors
      }
    };

    loadData();
  }, []);

  return (
    // Provide the data to children components
    <DataContext.Provider value={{ RadarsData, AccidentsData }}>
      {children}
    </DataContext.Provider>
  );
};
