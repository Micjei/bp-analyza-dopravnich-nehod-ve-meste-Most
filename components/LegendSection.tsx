import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
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
  return (
    <div
      className={`bottom-0 right-0 flex flex-col items-start p-5 bg-[#C8E6C9] border-2 border-[#66BB6A] rounded-[30px] shadow-md text-[#388E3C] opacity-80 whitespace-nowrap overflow-hidden transition-all duration-500 w-auto ${
        isLegendVisible ? "max-h-80" : "max-h-2"
      }`}
    >
      {/* Nadpis */}
      <h3
        className={`self-center transition-opacity duration-300 text-1xl font-bold ${
          isLegendVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        Legenda
      </h3>

      {/* Zelená čára pod nadpisem */}
      <div
        className={`w-[calc(100%+2.5rem)] -mx-5 border-b-2 border-[#66BB6A] mb-5 mt-2 transition-opacity duration-300 ${
          isLegendVisible ? "opacity-100" : "opacity-0"
        }`}
      ></div>

      <AnimatePresence>
        {isLegendVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {/** radary */}
            {showRadarData && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center space-x-2 mb-2"
              >
                <Image src="/camera.png" alt="Radar" width={24} height={24} />
                <span>Radar</span>
              </motion.div>
            )}

            {/** Dopravní nehody */}
            {showAccidentData && (
              <div className="flex flex-col">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center space-x-2 mb-2"
                >
                  <Image
                    src="/car-crash.png"
                    alt="Dopravní nehoda"
                    width={24}
                    height={24}
                  />
                  <span>Dopravní nehoda</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center space-x-2 mb-2"
                >
                  <Image
                    src="/car-crash-pedestrian.png"
                    alt="Nehoda s chodcem"
                    width={24}
                    height={24}
                  />
                  <span>Nehoda s chodcem</span>
                </motion.div>
              </div>
            )}
            {/* Dopravní situace */}
            {showTrafficData && (
              <div className="flex flex-col">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center space-x-2"
                >
                  <div className="w-12 h-2 bg-red-500"></div>{" "}
                  {/* Červená čára */}
                  <span>Zácpa</span> {/* Popis */}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center space-x-2 mt-2"
                >
                  <div className="w-12 h-2 bg-orange-500"></div>{" "}
                  {/* Oranžová čára */}
                  <span>Pomalý provoz</span> {/* Popis */}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center space-x-2 mt-2"
                >
                  <div className="w-12 h-2 bg-yellow-500"></div>{" "}
                  {/* Žlutá čára */}
                  <span>Snížená rychlost</span> {/* Popis */}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center space-x-2 mt-2"
                >
                  <div className="w-12 h-2 bg-green-500"></div>{" "}
                  {/* Zelená čára */}
                  <span>Plynulý provoz</span> {/* Popis */}
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
