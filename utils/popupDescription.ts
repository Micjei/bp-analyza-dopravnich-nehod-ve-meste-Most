import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import "@/i18n";

export const getAlcoholDescription =
  (t: (key: string) => string) =>
  (alcohol: string | number): string => {
    const alcoholMap: Record<string, string> = {
      "0": `${t("not_detected")}`,
      "1": "0,01 - 0,24 ‰",
      "2": `${t("no")}`,
      "3": "0,24 - 0,5 ‰",
      "4": `${t("measurement_rejected")}`,
      //"5": "1,00 - 1,49 ‰",
      "6": "0,5 - 0,8 ‰",
      "7": "0,8 - 1,0 ‰",
      "8": "1,0 - 1,5 ‰",
      "9": `1,5 ‰ ${t("and_more")}`,
    };
    const parsedValue = parseInt(String(alcohol), 10);
    return alcoholMap[String(parsedValue)] || "Neznámá hodnota";
  };

export const getDrugsDescription =
  (t: (key: string) => string) =>
  (drug: string | number): string => {
    const drugMap: Record<string, string> = {
      "0": `${t("no")}`,
      "1": `${t("THC")}`,
      "2": `${t("AMP")}`,
      "3": `${t("MET")}`,
      "4": `${t("OPI")}`,
      "5": `${t("BZD")}`,
      "6": `${t("others")}`,
      "7": `${t("measurement_rejected")}`,
      "8": `${t("not_detected")}`,
    };
    const parsedValue = parseInt(String(drug), 10);
    return drugMap[String(parsedValue)] || "Neznámá hodnota";
  };

export const getConsequenceDescription =
  (t: (key: string) => string) =>
  (consequence: string | number): string => {
    const consequenceMap: Record<string, string> = {
      "1": `${t("fatal_injury")}`,
      "2": `${t("serious_injury")}`,
      "3": `${t("minor_injury")}`,
      "4": `${t("no_injury")}`,
    };
    const parsedValue = parseInt(String(consequence), 10);
    return consequenceMap[String(parsedValue)] || "Neznámá hodnota";
  };

export const getPedestrianDescription =
  (t: (key: string) => string) =>
  (pedestrian: string | number): string => {
    const pedestrianMap: Record<string, string> = {
      "1": `${t("man")}`,
      "2": `${t("woman")}`,
      "3": `${t("child")}`,
      "4": `${t("group_of_children")}`,
      "5": `${t("other_group")}`,
    };
    const parsedValue = parseInt(String(pedestrian), 10);
    return pedestrianMap[String(parsedValue)] || "Neznámá hodnota";
  };
