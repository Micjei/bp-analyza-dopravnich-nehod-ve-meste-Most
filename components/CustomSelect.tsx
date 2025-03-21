import React, { useEffect, useState, useRef } from "react";

interface CustomSelectProps {
  options: string[] | { label: string; value: string }[]; // Může být pole stringů nebo objektů { label, value }
  value: string | null;
  onChange: (value: string) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // Funkce pro získání labelu z option (pokud je to objekt)
  const getLabel = (option: string | { label: string; value: string }) => {
    if (typeof option === "string") {
      return option; // Pokud je option string, vrátíme ji přímo
    }
    return option.label; // Pokud je option objekt, vrátíme label
  };

  // Funkce pro zjištění, zda je option objekt (s label a value) nebo string
  const isOptionObject = (
    option: string | { label: string; value: string }
  ): option is { label: string; value: string } => {
    return typeof option !== "string";
  };

  const handleClick = (option: string | { label: string; value: string }) => {
    if (typeof option === "string") {
      onChange(option); // Pokud je option string, předáme ho přímo
    } else {
      onChange(option.value); // Pokud je option objekt, předáme value
    }
    setIsOpen(false);
  };

  // Funkce pro získání labelu pro aktuálně vybranou hodnotu
  const getSelectedLabel = () => {
    // Zde upravujeme logiku pro "mm" nebo "dd", když je selectedMonth nebo selectedDay "all"
    if (value === "mm" || value === "dd") {
      return value === "mm" ? "mm" : "dd"; // Pokud je value "mm" nebo "dd", vrátí odpovídající label
    }

    if (!value) return ""; // Pokud není vybraná žádná hodnota, vrátí prázdný text

    const selectedOption = options.find(
      (option) => (typeof option === "string" ? option : option.value) === value
    );
    return selectedOption ? getLabel(selectedOption) : ""; // Pokud nenalezne hodnotu, vrátí prázdný text
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={selectRef} className="relative py-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="border-2 border-[#ffffff] rounded px-2 text-left hover:bg-slate-50 active:bg-gray-300 active:scale-95"
      >
        {getSelectedLabel()} {/* Zobrazení labelu podle value */}
      </button>

      {isOpen && (
        <div
          className="fixed flex items-center justify-center z-[1000]"
          onClick={() => setIsOpen(false)} // Zavření při kliknutí mimo
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
                  {getLabel(option)} {/* Zobrazení labelu */}
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
