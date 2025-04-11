import React, { useEffect, useState, useRef } from "react";

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
  const [isOpen, setIsOpen] = useState(false);
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const selectRef = useRef<HTMLDivElement>(null);

  const getLabel = (option: string | { label: string; value: string }) => {
    return typeof option === "string" ? option : option.label;
  };

  const isOptionObject = (
    option: string | { label: string; value: string }
  ): option is { label: string; value: string } => {
    return typeof option !== "string";
  };

  const handleClick = (option: string | { label: string; value: string }) => {
    onChange(isOptionObject(option) ? option.value : option);
    setIsOpen(false);
  };

  const getSelectedLabel = () => {
    if (value === "mm" || value === "dd" || value == "yy") return value;
    if (!value) return "";

    const selectedOption = options.find(
      (option) => (typeof option === "string" ? option : option.value) === value
    );
    return selectedOption ? getLabel(selectedOption) : "";
  };

  // click mimo
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleButtonClick = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    setClickPosition({ x: clientX, y: clientY });
    setIsOpen(!isOpen);
  };

  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;

  const desktopColumnCount = isOptionObject(options[0])
    ? Math.min(options.length, 3)
    : Math.min(options.length, 7);

  const mobileColumnCount = isOptionObject(options[0])
    ? Math.min(options.length, 1)
    : Math.min(options.length, 3);

  return (
    <div ref={selectRef} className="relative py-1">
      <button
        onClick={handleButtonClick}
        className="border-2 rounded px-2 text-left hover:bg-dropdown-bg-hover active:bg-dropdown-bg-active active:scale-95 hover:text-dropdown-text-hover bg-dropdown-bg border-dropdown-border"
      >
        {getSelectedLabel()}
      </button>

      {isOpen && (
        <div
          className="fixed z-[1000]"
          style={{
            left: isDesktop ? clickPosition.x + 10 : "50%",
            top: isDesktop ? clickPosition.y + 10 : "50%",
            transform: isDesktop ? "none" : "translate(-50%, -50%)",
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-max bg-dropdown-bg border rounded shadow-lg p-2"
            onClick={(e) => e.stopPropagation()}
          >
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
                  className="border rounded p-2 text-center hover:bg-dropdown-bg-hover hover:text-dropdown-text-hover"
                >
                  {getLabel(option)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
