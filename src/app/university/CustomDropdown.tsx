import { useEffect, useMemo, useRef, useState } from "react";

import clsx from "clsx";

import { IconDirectionDown } from "@/public/svgs/mentor";

const ChevronDownIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
      clipRule="evenodd"
    />
  </svg>
);

// --- 외부 클릭 감지 Hook ---
const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};
const CustomDropdown = ({ options, value, onChange, placeholder, placeholderSelect, icon, placeholderIcon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  useClickOutside(dropdownRef, () => setIsOpen(false));

  const selectedOptionLabel = useMemo(() => options.find((opt) => opt.value === value)?.label, [options, value]);
  const isSelected = !!value;
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "flex w-full items-center rounded-lg p-3.5 text-left transition-colors",
          isSelected && "bg-primary-100",
          !isSelected && "border border-k-100 text-k-400",
          isOpen && "border-primary-500",
        )}
      >
        {isSelected ? <span className="mr-3">{icon}</span> : <span className="mr-3">{placeholderIcon}</span>}

        <span className={clsx("flex-1 font-semibold text-k-700")}>{placeholder}</span>
        <span className={clsx("flex items-center font-semibold", isSelected ? "text-primary" : "text-k-300")}>
          {selectedOptionLabel || placeholderSelect}
          <span className="ml-2 h-5 w-5">
            <IconDirectionDown />
          </span>
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border bg-white shadow-lg">
          <ul>
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={clsx(
                    "hover:bg-primary-50 w-full px-4 py-2.5 text-left text-gray-700",
                    option.value === value && "bg-primary-100 font-semibold text-primary-700",
                  )}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
export default CustomDropdown;
