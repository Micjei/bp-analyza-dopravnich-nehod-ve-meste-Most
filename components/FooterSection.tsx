"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "@/i18n"; // i18n configuration for translations

// Component to display a footer with the last data update timestamp
const FooterSection: React.FC = ({}) => {
  const { t, i18n } = useTranslation(); // Translation hook
  const [isClient, setIsClient] = useState(false); // Ensures component renders only on client
  const [lastUpdate, setLastUpdate] = useState<string>(""); // Stores the formatted update timestamp

  useEffect(() => {
    setIsClient(true); // Indicate that rendering is happening on the client
    setLastUpdate(new Date().toLocaleString()); // Set the current date and time as the "last update"
  }, []);

  // Prevent rendering on the server to avoid hydration mismatch
  if (!isClient) return null;

  return (
    <div className="fixed bottom-0 w-[100vw] flex flex-row items-center justify-center bg-footer-bg border-2 border-footer-border shadow-md text-footer-text opacity-80 whitespace-nowrap">
      {lastUpdate && (
        <p className="text-sm italic flex space-x-2">
          <span>{`${t("last_update")}`}:</span>
          <span>{lastUpdate}</span>
        </p>
      )}
    </div>
  );
};

export default FooterSection;
