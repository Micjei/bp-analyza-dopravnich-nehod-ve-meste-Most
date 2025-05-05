import React, { useState } from "react";
import { useTranslation } from "react-i18next";

// Props type definition – expects a callback to execute when clicked
interface ResetButtonProps {
  onClick: () => void;
}

const ResetButton: React.FC<ResetButtonProps> = ({ onClick }) => {
  const { t } = useTranslation(); // Translation hook
  const [rotation, setRotation] = useState(0); // State to control rotation animation

  // Handle click: trigger rotation and execute the provided callback
  const handleClick = () => {
    setRotation((prev) => prev - 720); // Rotate the icon by 720 degrees counter-clockwise
    onClick(); // Call parent reset logic
  };

  return (
    <div className="w-fit flex flex-col">
      <button
        onClick={handleClick}
        className="hover:opacity-80 transition-transform flex flex-row gap-2"
      >
        {/* Refresh icon with animated rotation */}
        <img
          src="/refresh.png"
          alt="Reset"
          className="w-6 h-6 transition-transform duration-700"
          style={{ transform: `rotate(${rotation}deg)` }}
        />
      </button>
    </div>
  );
};

export default ResetButton;
