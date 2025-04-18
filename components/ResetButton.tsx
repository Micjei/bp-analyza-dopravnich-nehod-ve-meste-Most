import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface ResetButtonProps {
  onClick: () => void;
}

const ResetButton: React.FC<ResetButtonProps> = ({ onClick }) => {
  const { t } = useTranslation();
  const [rotation, setRotation] = useState(0);

  const handleClick = () => {
    setRotation((prev) => prev - 720);
    onClick();
  };

  return (
    <div className="w-fit flex flex-col">
      <button
        onClick={handleClick}
        className="hover:opacity-80 transition-transform flex flex-row gap-2"
      >
        <img
          src="/refresh.png"
          alt="Reset"
          className="w-6 h-6 transition-transform duration-700"
          style={{ transform: `rotate(${rotation}deg)` }}
        />
        {/*<span>{t("reset")}</span>*/}
      </button>
    </div>
  );
};

export default ResetButton;
