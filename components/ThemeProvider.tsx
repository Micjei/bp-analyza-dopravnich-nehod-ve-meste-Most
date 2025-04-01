"use client";

import { ReactNode, useEffect, useState } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDark(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle("dark", newTheme);
  };

  return (
    <div>
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-[10000] bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-3 py-1 rounded"
      >
        {isDark ? "☀️ Light" : "🌙 Dark"}
      </button>
      {children}
    </div>
  );
};

export default ThemeProvider;
