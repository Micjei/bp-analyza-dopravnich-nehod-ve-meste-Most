import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import ReactDOM from "react-dom";
import "@/i18n";

interface CustomSelectProps {
  options: string[] | { label: string; value: string }[];
  value: string | null;
  onChange: (value: string) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isOptionObject = (
    option: string | { label: string; value: string }
  ): option is { label: string; value: string } => typeof option !== "string";

  const getLabel = (option: string | { label: string; value: string }) =>
    typeof option === "string" ? option : option.label;

  const handleClick = (option: string | { label: string; value: string }) => {
    onChange(isOptionObject(option) ? option.value : option);
    setIsOpen(false);
  };

  const getSelectedLabel = () => {
    if (
      value === `${t("mm")}` ||
      value === `${t("dd")}` ||
      value === `${t("yy")}`
    )
      return value;
    if (!value) return "";

    const selectedOption = options.find(
      (option) => (typeof option === "string" ? option : option.value) === value
    );
    return selectedOption ? getLabel(selectedOption) : "";
  };

  // kliknutí mimo – teď zahrnuje i portál
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(e.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleButtonClick = (e: React.MouseEvent) => {
    setClickPosition({ x: e.clientX, y: e.clientY });
    setIsOpen(!isOpen);
  };

  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;

  const desktopColumnCount = isOptionObject(options[0])
    ? Math.min(options.length, 3)
    : Math.min(options.length, 7);

  const mobileColumnCount = isOptionObject(options[0])
    ? Math.min(options.length, 1)
    : Math.min(options.length, 3);

  const dropdown = (
    <div
      ref={dropdownRef}
      className="fixed z-[1003]"
      style={{
        left: isDesktop ? clickPosition.x + 10 : "50%",
        top: isDesktop ? clickPosition.y + 10 : "50%",
        transform: isDesktop ? "none" : "translate(-50%, -50%)",
      }}
    >
      <div className="w-max bg-dropdown-bg border rounded shadow-lg p-2">
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: isDesktop
              ? `repeat(${desktopColumnCount}, minmax(40px, 1fr))`
              : `repeat(${mobileColumnCount}, minmax(40px, 1fr))`,
          }}
        >
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleClick(option)}
              className="border rounded p-2 text-center bg-dropdown-bg hover:bg-dropdown-bg-hover text-dropdown-text hover:text-dropdown-text-hover"
            >
              {getLabel(option)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div ref={selectRef} className="relative py-1">
      <button
        onClick={handleButtonClick}
        className="border-2 rounded px-2 text-left bg-dropdown-bg hover:bg-dropdown-bg-hover active:bg-dropdown-bg-active active:scale-95 text-dropdown-text hover:text-dropdown-text-hover border-dropdown-border"
      >
        {getSelectedLabel()}
      </button>
      {isOpen && typeof window !== "undefined"
        ? ReactDOM.createPortal(dropdown, document.body)
        : null}
    </div>
  );
};

export default CustomSelect;
