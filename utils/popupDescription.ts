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
    return alcoholMap[String(parsedValue)] || `${t("unknown_value")}`;
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
    return drugMap[String(parsedValue)] || `${t("unknown_value")}`;
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
    return consequenceMap[String(parsedValue)] || `${t("unknown_value")}`;
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
    return pedestrianMap[String(parsedValue)] || `${t("unknown_value")}`;
  };

// Zavinění nehody (p10)
export const getFaultDescription =
  (t: (key: string) => string) =>
  (fault: string | number): string => {
    const faultMap: Record<string, string> = {
      "1": `${t("driver_motor_vehicle")}`,
      "2": `${t("driver_non_motor_vehicle")}`,
      "3": `${t("pedestrian")}`,
      "4": `${t("animal")}`,
      "5": `${t("other_participant")}`,
      "6": `${t("road_defect")}`,
      "7": `${t("vehicle_defect")}`,
      "0": `${t("other_fault")}`,
    };
    const parsedValue = parseInt(String(fault), 10);
    return faultMap[String(parsedValue)] || `${t("unknown_value")}`;
  };

// Hlavní příčina nehody (p12)
export const getCauseDescription =
  (t: (key: string) => string) =>
  (cause: string | number): string => {
    const causeMap: Record<string, string> = {
      "100": `${t("not_fault_of_driver")}`,
      "201": `${t("speed_not_adjusted_traffic")}`,
      "202": `${t("speed_not_adjusted_visibility")}`,
      "203": `${t("speed_not_adjusted_vehicle")}`,
      "204": `${t("speed_not_adjusted_road")}`,
      "205": `${t("speed_not_adjusted_technical")}`,
      "206": `${t("speed_exceeded_rules")}`,
      "207": `${t("speed_exceeded_sign")}`,
      "208": `${t("speed_not_adjusted_wind")}`,
      "209": `${t("speed_problem")}`,
      "301": `${t("overtaking_right")}`,
      "302": `${t("overtaking_insufficient_side")}`,
      "303": `${t("overtaking_insufficient_view")}`,
      "304": `${t("overtaking_endangered_oncoming")}`,
      "305": `${t("overtaking_endangered_overtaken")}`,
      "306": `${t("overtaking_left_turning_vehicle")}`,
      "307": `${t("overtaking_prohibited_area")}`,
      "308": `${t("overtaking_crossed_line")}`,
      "309": `${t("blocking_overtaking")}`,
      "310": `${t("failure_to_notice_overtaking")}`,
      "311": `${t("overtaking_fault")}`,
      "401": `${t("running_red_light")}`,
      "402": `${t("disobey_stop_sign")}`,
      "403": `${t("disobey_yield_sign")}`,
      "404": `${t("yield_right_from_right")}`,
      "405": `${t("yield_left_turn")}`,
      "406": `${t("yield_tram_turning")}`,
      "407": `${t("yield_obstacle")}`,
      "408": `${t("yield_merging")}`,
      "409": `${t("yield_entering_road")}`,
      "410": `${t("yield_turning_reversing")}`,
      "411": `${t("yield_lane_change")}`,
      "412": `${t("yield_pedestrian_crosswalk")}`,
      "413": `${t("yield_left_parallel_vehicle")}`,
      "414": `${t("yield_failure")}`,
      "501": `${t("wrong_side_of_road")}`,
      "502": `${t("insufficient_clearance")}`,
      "503": `${t("unsafe_following_distance")}`,
      "504": `${t("improper_turning_or_reversing")}`,
      "505": `${t("direction_indicator_error")}`,
      "506": `${t("reckless_aggressive_driving")}`,
      "507": `${t("sudden_braking")}`,
      "508": `${t("inattention")}`,
      "509": `${t("vehicle_unsecured_movement")}`,
      "510": `${t("driving_unpaved_road")}`,
      "511": `${t("loss_of_control")}`,
      "512": `${t("wrong_way_oneway")}`,
      "513": `${t("police_stopping_device")}`,
      "514": `${t("police_weapon")}`,
      "515": `${t("police_action")}`,
      "516": `${t("driving_fault")}`,
      "601": `${t("steering_defect")}`,
      "602": `${t("brake_defect")}`,
      "603": `${t("parking_brake_defect")}`,
      "604": `${t("tire_wear")}`,
      "605": `${t("tire_puncture")}`,
      "606": `${t("lighting_defect")}`,
      "607": `${t("braking_hose_defect")}`,
      "608": `${t("incorrect_load")}`,
      "609": `${t("lost_wheel")}`,
      "610": `${t("mechanical_fault_locking_wheel")}`,
      "611": `${t("broken_spring")}`,
      "612": `${t("damaged_sideboard")}`,
      "613": `${t("trailer_hitch_defect")}`,
      "614": `${t("broken_drive_shaft")}`,
      "615": `${t("technical_fault")}`,
    };
    const parsedValue = parseInt(String(cause), 10);
    return causeMap[String(parsedValue)] || `${t("unknown_value")}`;
  };

// Celková hmotná škoda (p14)
export const getDamageDescription =
  (t: (key: string) => string) =>
  (damage: string | number): string => {
    if (damage == null || damage === "") {
      return `${t("unknown_value")}`;
    }
    const parsedValue = parseInt(String(damage), 10);
    if (isNaN(parsedValue)) {
      return `${t("unknown_value")}`;
    }
    return `${parsedValue.toLocaleString("cs-CZ")} Kč`;
  };

// Druh vozidla (p44)
export const getVehicleTypeDescription =
  (t: (key: string) => string) =>
  (vehicleType: string | number): string => {
    const vehicleTypeMap: Record<string, string> = {
      "2": `${t("motorcycle")}`,
      "3": `${t("car_without_trailer")}`,
      "4": `${t("car_with_trailer")}`,
      "5": `${t("truck")}`,
      "6": `${t("truck_with_trailer")}`,
      "7": `${t("truck_with_semitrailer")}`,
      "8": `${t("bus")}`,
      "9": `${t("tractor")}`,
      "10": `${t("tram")}`,
      "11": `${t("trolleybus")}`,
      "12": `${t("other_motor_vehicle")}`,
      "13": `${t("bicycle")}`,
      "14": `${t("horse_drawn_vehicle")}`,
      "15": `${t("other_non_motor_vehicle")}`,
      "16": `${t("train")}`,
      "17": `${t("unknown_or_driver_fled")}`,
      "18": `${t("other_vehicle_type")}`,
    };
    const parsedValue = parseInt(String(vehicleType), 10);
    console.log(vehicleType);
    return vehicleTypeMap[String(parsedValue)] || `${t("unknown_value")}`;
  };
