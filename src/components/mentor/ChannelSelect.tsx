import { useEffect, useRef, useState } from "react";

import { ChannelType } from "@/types/mentor";

import { IconDirectionDown, IconDirectionUp } from "@/public/svgs/mentor";

interface ChannelSelectProps {
  name?: string;
}

const ChannelSelect = ({ name = "channel" }: ChannelSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleChannelChange = (value: string | null) => {
    setSelectedValue(value);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative h-[45px]" ref={dropdownRef}>
      {/* 숨겨진 input */}
      <input type="hidden" name={name} value={selectedValue ? selectedValue : ""} />
      {/* slect요소 */}
      <button
        type="button"
        onClick={toggleDropdown}
        className={`flex w-full items-center justify-between rounded-lg border border-gray-300 px-4 py-3 focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary`}
      >
        <span className={`text-sm font-light ${selectedValue ? "text-secondary" : "text-k-300"}`}>
          {selectedValue || "채널을 선택해주세요."}
        </span>
        <span className="h-4 w-4 text-gray-400">{isOpen ? <IconDirectionUp /> : <IconDirectionDown />}</span>
      </button>

      {/* option요소 */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border border-gray-300 bg-white shadow-lg">
          <button
            type="button"
            className={`w-full px-4 py-3 text-left text-sm font-normal text-k-900 hover:bg-secondary-100 hover:text-secondary`}
            onClick={() => handleChannelChange(null)}
          >
            없음
          </button>
          {Object.values(ChannelType).map((option, optionIndex) => (
            <button
              key={option}
              type="button"
              onClick={() => handleChannelChange(option)}
              className={`w-full px-4 py-3 text-left text-sm font-normal text-k-900 hover:bg-secondary-100 hover:text-secondary ${
                optionIndex === Object.values(ChannelType).length - 1 ? "rounded-b-lg" : "border-b border-gray-100"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
export default ChannelSelect;
