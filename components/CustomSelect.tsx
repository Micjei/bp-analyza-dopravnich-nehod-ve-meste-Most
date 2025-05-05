import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import ReactDOM from "react-dom";
import "@/i18n"; // Internationalization config

// Props definition
interface CustomSelectProps {
  options: string[] | { label: string; value: string }[]; // Select options
  value: string | null; // Currently selected value
  onChange: (value: string) => void; // Callback for when option is selected
}

// CustomSelect component
const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false); // Dropdown open state
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 }); // Position of click for dropdown placement
  const selectRef = useRef<HTMLDivElement>(null); // Reference to the select button
  const dropdownRef = useRef<HTMLDivElement>(null); // Reference to the dropdown content

  // Helper to determine if an option is an object (with label/value) or plain string
  const isOptionObject = (
    option: string | { label: string; value: string }
  ): option is { label: string; value: string } => typeof option !== "string";

  // Extract label for a given option
  const getLabel = (option: string | { label: string; value: string }) =>
    typeof option === "string" ? option : option.label;

  // Handle option click
  const handleClick = (option: string | { label: string; value: string }) => {
    onChange(isOptionObject(option) ? option.value : option);
    setIsOpen(false); // Close dropdown after selection
  };

  // Get label for the currently selected value
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

  // Close dropdown if user clicks outside the component or dropdown
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

  // Handle opening dropdown and saving cursor position
  const handleButtonClick = (e: React.MouseEvent) => {
    setClickPosition({ x: e.clientX, y: e.clientY });
    setIsOpen(!isOpen);
  };

  // Determine if user is on desktop (based on screen width)
  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;

  // Determine how many columns to use in dropdown (for layout)
  const desktopColumnCount = isOptionObject(options[0])
    ? Math.min(options.length, 3)
    : Math.min(options.length, 7);

  const mobileColumnCount = isOptionObject(options[0])
    ? Math.min(options.length, 1)
    : Math.min(options.length, 3);

  // Dropdown content (positioned absolutely via portal)
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
      {/* Button that toggles dropdown */}
      <button
        onClick={handleButtonClick}
        className="border-2 rounded px-2 text-left bg-dropdown-bg hover:bg-dropdown-bg-hover active:bg-dropdown-bg-active active:scale-95 text-dropdown-text hover:text-dropdown-text-hover border-dropdown-border"
      >
        {getSelectedLabel()}
      </button>

      {/* Render dropdown using portal (outside component tree) */}
      {isOpen && typeof window !== "undefined"
        ? ReactDOM.createPortal(dropdown, document.body)
        : null}
    </div>
  );
};

export default CustomSelect;
