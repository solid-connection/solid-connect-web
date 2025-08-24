import ReusableDropdown from "@/components/ui/ReusableDropdown";

import { IconDirectionDown } from "@/public/svgs/mentor";

interface FavoriteDropDownProps {
  items: string[];
  handleSelect: (value: string) => void;
}

const FavoriteDropDown = ({ items, handleSelect }: FavoriteDropDownProps) => {
  return (
    <ReusableDropdown items={items} onSelect={handleSelect}>
      <div className="h-8 w-8">
        <IconDirectionDown />
      </div>
    </ReusableDropdown>
  );
};

export default FavoriteDropDown;
