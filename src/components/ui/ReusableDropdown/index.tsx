import useDropDownHandler from "./hooks/useDropDownHandler";

export interface DropdownItem {
  value: string;
  label: string;
}
interface ReusableDropdownProps {
  items: DropdownItem[];
  selectedValue: string;
  onSelect: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

const ReusableDropdown = ({ items, selectedValue, onSelect, className = "", children }: ReusableDropdownProps) => {
  const { isOpen, toggleDropdown, handleSelect, dropdownPosition, dropdownRef } = useDropDownHandler({ onSelect });
  return (
    <div className={`relative h-full w-full ${className}`} ref={dropdownRef}>
      <div
        onClick={toggleDropdown}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") toggleDropdown();
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
              key={item.value}
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
