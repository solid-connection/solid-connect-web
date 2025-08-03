// DropdownItem 타입 정의
interface DropdownItem {
  label: string;
  action: () => void;
}

// Dropdown 컴포넌트의 props 타입 정의
interface DropdownProps {
  options: DropdownItem[];
}

const Dropdown = ({ options }: DropdownProps) => (
  <div className="w-37 absolute right-0 top-full z-[1000] flex flex-col rounded-lg shadow-[0px_10px_50px_0px_rgba(0,0,0,0.1)]">
    {options.map((option, index) => (
      <button
        key={option.label}
        className={`h-10 cursor-pointer border-none bg-white px-3 py-2 ${index === 0 && options.length > 1 ? "rounded-t-lg" : ""} ${index === options.length - 1 && options.length > 1 ? "rounded-b-lg" : ""} ${options.length === 1 ? "rounded-lg" : ""} ${index !== options.length - 1 ? "border-b border-black/10" : ""} `}
        onClick={option.action}
        type="button"
      >
        {option.label}
      </button>
    ))}
  </div>
);

export default Dropdown;
