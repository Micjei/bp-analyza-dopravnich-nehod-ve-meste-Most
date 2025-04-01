"use client";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "@/i18n";

const FooterSection: React.FC = ({}) => {
  const { t, i18n } = useTranslation();
  const [isClient, setIsClient] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  useEffect(() => {
    setIsClient(true);
    setLastUpdate(new Date().toLocaleString());
  }, []);

  if (!isClient) return null;
  return (
    <div className="fixed bottom-0 w-full flex flex-row items-center justify-center bg-footer-bg border-2 border-footer-border shadow-md text-footer-text opacity-80 whitespace-nowrap">
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
