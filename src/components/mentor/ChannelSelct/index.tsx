import { Control, FieldValues, useController } from "react-hook-form";

import useSelectHandler from "./_hooks/useSelectHandler";

import { ChannelType } from "@/types/mentor";

import { IconDirectionDown, IconDirectionUp } from "@/public/svgs/mentor";

interface ChannelSelectProps {
  name?: string;
  control: Control<FieldValues>;
  onChannelChange?: (val: string | null) => void;
}

const ChannelSelect = ({ name = "channel", control, onChannelChange }: ChannelSelectProps) => {
  const { isOpen, dropdownRef, handleChannelChange, toggleDropdown } = useSelectHandler({
    name,
    control,
    onChannelChange,
  });

  const {
    field: { value },
  } = useController({ name, control }) as { field: { value: string | null } };

  return (
    <div className="relative h-11" ref={dropdownRef}>
      {/* slect요소 */}
      <button
        type="button"
        onClick={toggleDropdown}
        className={`flex w-full items-center justify-between rounded-lg border border-gray-300 px-4 py-3 focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary`}
      >
        <span className={`text-sm font-light ${value ? "text-secondary" : "text-k-300"}`}>
          {value === null ? "선택 안함" : value || "채널을 선택해주세요."}
        </span>
        <span className="h-4 w-4 text-gray-400">{isOpen ? <IconDirectionUp /> : <IconDirectionDown />}</span>
      </button>

      {/* option요소 */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border border-gray-300 bg-white shadow-lg">
          <button
            type="button"
            className={`w-full border-b border-gray-100 px-4 py-3 text-left text-sm font-normal text-gray-500 hover:bg-gray-50 hover:text-gray-700`}
            onClick={() => handleChannelChange(null)}
          >
            선택 안함
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
