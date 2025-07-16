import { useEffect, useRef, useState } from "react";

export interface DropdownItem {
  id: string;
  label: string;
  value: string;
}

interface ReusableDropdownProps {
  items: DropdownItem[];
  selectedValue: string;
  onSelect: (value: string) => void;
  className?: string;
  children: React.ReactNode; // 버튼을 자식으로 받기
}

const ReusableDropdown = ({ items, selectedValue, onSelect, className = "", children }: ReusableDropdownProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dropdownPosition, setDropdownPosition] = useState<"left" | "right">("left");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (item: DropdownItem) => {
    onSelect(item.value);
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      // 드롭다운의 너비를 고려해서 우측 여백이 부족하면 right 정렬
      const dropdownWidth = 200; // 예상 드롭다운 너비
      if (rect.right + dropdownWidth > viewportWidth) {
        setDropdownPosition("right");
      } else {
        setDropdownPosition("left");
      }
    }
  }, [isOpen]);

  return (
    <div className={`relative h-full w-full ${className}`} ref={dropdownRef}>
      <div
        onClick={toggleDropdown}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            toggleDropdown();
          }
        }}
        role="button"
        tabIndex={0}
      >
        {children}
      </div>

      {isOpen && (
        <div
          className={`absolute top-full z-10 min-w-[120px] rounded-md border bg-k-100 shadow-sdwC ${
            dropdownPosition === "right" ? "right-0" : "left-0"
          }`}
        >
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
