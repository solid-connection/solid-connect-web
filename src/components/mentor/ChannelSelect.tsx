import { useState } from "react";

import { ChannelType } from "@/types/mentor";

import { IconDirectionDown, IconDirectionUp } from "@/public/svgs/mentor";

interface ChannelSelectProps {
  name?: string;
}

const ChannelSelect = ({ name = "channel" }: ChannelSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const handleChannelChange = (value: string | null) => {
    setSelectedValue(value);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <input type="hidden" name={name} value={selectedValue ? selectedValue : ""} />
      <button
        type="button"
        onClick={toggleDropdown}
        className={`flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium ${
          selectedValue ? "text-secondary" : "text-gray-500"
        } hover:border-gray-400 focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary`}
      >
        <span>{selectedValue || "채널 선택"}</span>
        <span className="h-4 w-4 text-gray-400">{isOpen ? <IconDirectionUp /> : <IconDirectionDown />}</span>
      </button>

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
