import { useState } from "react";

import { IconDirectionDown } from "@/public/svgs/mentor";

export interface DropdownItem {
  id: string;
  label: string;
  value: string;
}

interface ReusableDropdownProps {
  items: DropdownItem[];
  selectedValue: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const ReusableDropdown = ({
  items,
  selectedValue,
  onSelect,
  placeholder = "선택하세요",
  className = "",
}: ReusableDropdownProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const selectedItem = items.find((item) => item.value === selectedValue);
  const displayText = selectedItem ? selectedItem.label : placeholder;

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (item: DropdownItem) => {
    onSelect(item.value);
    setIsOpen(false);
  };

  return (
    <div className={`relative h-full w-full ${className}`}>
      <button
        onClick={toggleDropdown}
        className="flex h-full w-full items-center justify-between px-4 text-lg font-semibold leading-normal text-k-900"
      >
        {displayText}
        <span className="h-[30px] w-[30px]">
          <IconDirectionDown />
        </span>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-10 w-full rounded-md border bg-k-100 shadow-sdwC">
          {items.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleSelect(item)}
              className={`h-[40px] w-full px-4 text-left text-sm font-medium text-k-700 hover:bg-primary-100 ${
                index === 0 ? "rounded-t-md" : ""
              } ${index === items.length - 1 ? "rounded-b-md" : ""} ${
                selectedValue === item.value ? "bg-primary-100" : "bg-k-0"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReusableDropdown;
