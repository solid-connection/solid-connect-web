interface DropdownItem {
  label: string;
  action: () => void;
}

interface DropdownProps {
  options: DropdownItem[];
}

const SlimDropdown = ({ options }: DropdownProps) => (
  <div className="absolute z-[1000] flex w-[84px] flex-col rounded-lg bg-white py-3.5 shadow-[0_0px_10px_0px_rgb(0,0,0,0.2)]">
    {options.map((option) => (
      <button
        key={option.label}
        className="flex h-9 items-center justify-center px-3 py-2 hover:bg-line-1"
        onClick={option.action}
      >
        <span className="font-serif typo-regular-1">{option.label}</span>
      </button>
    ))}
  </div>
);

export default SlimDropdown;
