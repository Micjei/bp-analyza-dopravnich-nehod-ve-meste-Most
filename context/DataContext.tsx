"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"; // Importuj ReactNode
import { fetchRadarsData, fetchAccidentsData } from "@/utils/fetchData";

interface DataContextType {
  RadarsData: any;
  AccidentsData: any;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

// Upravujeme DataProvider komponentu, aby měla typ pro children
export const DataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Přidáme typ pro children
  const [RadarsData, setRadarsData] = useState<any>(null);
  const [AccidentsData, setAccidentsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const radars = await fetchRadarsData();
        setRadarsData(radars);
        const accidents = await fetchAccidentsData();
        setAccidentsData(accidents);
      } catch (error) {
        console.error("Error loading data", error);
      }
    };

    loadData();
  }, []);

  return (
    <DataContext.Provider value={{ RadarsData, AccidentsData }}>
      {children}
    </DataContext.Provider>
  );
};
