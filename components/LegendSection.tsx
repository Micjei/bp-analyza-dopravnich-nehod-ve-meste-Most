import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import "@/i18n"; // i18n translation config

interface LegendSectionProps {
  isLegendVisible: boolean;
  showTrafficData: boolean;
  showAccidentData: boolean;
  showRadarData: boolean;
}

const LegendSection: React.FC<LegendSectionProps> = ({
  isLegendVisible,
  showTrafficData,
  showAccidentData,
  showRadarData,
}) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset scroll when legend is closed
  useEffect(() => {
    if (!isLegendVisible && containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [isLegendVisible]);

  return (
    <div
      ref={containerRef}
      className={`relative bottom-0 right-0 flex flex-col items-start p-5 bg-legend-bg border-2 border-legend-border rounded-[30px] shadow-md text-legend-text opacity-80 whitespace-nowrap ${
        isLegendVisible ? "overflow-y-auto" : "overflow-hidden"
      } overflow-x-hidden scrollbar-hide transition-all duration-500
 w-auto ${isLegendVisible ? "md:max-h-80 max-h-32" : "max-h-2"}`}
    >
      {/* Legend label when collapsed – centered and non-interactive */}
      {!isLegendVisible && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-sm font-semibold text-filters-text tracking-wide uppercase">
            {`${t("legend_title")}`}
          </div>
        </div>
      )}

      {/* Title */}
      <h3
        className={`self-center transition-opacity duration-300 text-1xl font-bold ${
          isLegendVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {`${t("legend_title")}`}
      </h3>

      {/* Divider line under the title */}
      <div
        className={`w-[calc(100%+2.5rem)] -mx-5 border-b-2 border-legend-border mb-5 mt-2 transition-opacity duration-300 ${
          isLegendVisible ? "opacity-100" : "opacity-0"
        }`}
      ></div>

      {/* Animated visibility of the content */}
      <AnimatePresence>
        {isLegendVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {/* Radar legend */}
            {showRadarData && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center space-x-2 mb-2"
              >
                <Image src="/camera.png" alt="Radar" width={24} height={24} />
                <span>{`${t("radars")}`}</span>
              </motion.div>
            )}

            {/* Accident legend */}
            {showAccidentData && (
              <div className="flex flex-col">
                {/* Vehicle-only accidents */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center space-x-2 mb-2"
                >
                  <Image
                    src="/car-crash.png"
                    alt="Traffic accident"
                    width={24}
                    height={24}
                  />
                  <span>{`${t("car_accidents")}`}</span>
                </motion.div>

                {/* Pedestrian accidents */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center space-x-2 mb-2"
                >
                  <Image
                    src="/car-crash-pedestrian.png"
                    alt="Pedestrian accident"
                    width={24}
                    height={24}
                  />
                  <span>{`${t("pedestrian_accidents")}`}</span>
                </motion.div>
              </div>
            )}

            {/* Traffic condition legend */}
            {showTrafficData && (
              <div className="flex flex-col">
                {/* Jam */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center space-x-2"
                >
                  <div className="w-12 h-2 bg-red-500"></div>
                  <span>{`${t("traffic_jam")}`}</span>
                </motion.div>

                {/* Slow traffic */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center space-x-2 mt-2"
                >
                  <div className="w-12 h-2 bg-orange-500"></div>
                  <span>{`${t("slow_traffic")}`}</span>
                </motion.div>

                {/* Reduced speed */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center space-x-2 mt-2"
                >
                  <div className="w-12 h-2 bg-yellow-500"></div>
                  <span>{`${t("reduced_speed")}`}</span>
                </motion.div>

                {/* Smooth traffic */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center space-x-2 mt-2"
                >
                  <div className="w-12 h-2 bg-green-500"></div>
                  <span>{`${t("smooth_traffic")}`}</span>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LegendSection;
