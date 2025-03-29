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
  const [clickPosition, setClickPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
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
    if (value === "mm" || value === "dd") return value;
    if (!value) return "";

    const selectedOption = options.find(
      (option) => (typeof option === "string" ? option : option.value) === value
    );
    return selectedOption ? getLabel(selectedOption) : "";
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={selectRef} className="relative py-1">
      <button
        onClick={(e) => {
          setIsOpen(!isOpen);
          setClickPosition({ x: e.clientX, y: e.clientY });
        }}
        className="border-2 border-[#ffffff] rounded px-2 text-left hover:bg-slate-50 active:bg-gray-300 active:scale-95"
      >
        {getSelectedLabel()}
      </button>

      {isOpen && clickPosition && (
        <div
          className="fixed z-[1000]"
          style={{
            top: clickPosition.y + 10,
            left: clickPosition.x + 10,
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-max bg-white border rounded shadow-lg p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: isOptionObject(options[0])
                  ? `repeat(${Math.min(options.length, 3)}, minmax(40px, 1fr))`
                  : `repeat(${Math.min(options.length, 7)}, minmax(40px, 1fr))`,
              }}
            >
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleClick(option)}
                  className="border rounded p-2 text-center hover:bg-gray-200"
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
