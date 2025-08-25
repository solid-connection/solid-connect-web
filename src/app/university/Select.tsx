import React, { useEffect, useMemo, useRef, useState } from "react";

import clsx from "clsx";

// --- 아이콘 (임시) ---
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
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
};

// --- 커스텀 드롭다운 컴포넌트 ---
const CustomDropdown = ({ options, value, onChange, placeholder, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 외부 클릭 시 드롭다운을 닫습니다.
  useClickOutside(dropdownRef, () => setIsOpen(false));

  const selectedOption = useMemo(() => options.find((opt) => opt.value === value), [options, value]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 선택된 값을 보여주는 버튼 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center rounded-lg border bg-gray-100 p-3 text-left"
      >
        {icon && <span className="mr-2 text-purple-600">{icon}</span>}
        <span className={clsx("flex-1", selectedOption ? "text-gray-800" : "text-gray-500")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div className={clsx("transition-transform", isOpen && "rotate-180")}>
          <ChevronDownIcon />
        </div>
      </button>

      {/* 옵션 목록 */}
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
                    "w-full px-4 py-2 text-left hover:bg-purple-50",
                    option.value === value && "bg-purple-100 font-semibold text-purple-700",
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
