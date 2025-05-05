"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// Define the shape of the ThemeContext
interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

// Create the context with undefined as default (for safety in consumer hook)
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Custom hook to access the ThemeContext
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};

// Provider component that wraps parts of the app that need theme state
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check if the user has a saved preference in localStorage
    const storedTheme = localStorage.getItem("theme");

    // Detect system preference for dark mode
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    // Determine the initial theme based on saved or system preference
    const initial = storedTheme ? storedTheme === "dark" : prefersDark;

    setIsDark(initial);
    document.documentElement.classList.toggle("dark", initial);
  }, []);

  // Toggles between dark and light theme
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);

    // Toggle the `dark` class on the <html> element
    document.documentElement.classList.toggle("dark", newTheme);

    // Save preference to localStorage
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
