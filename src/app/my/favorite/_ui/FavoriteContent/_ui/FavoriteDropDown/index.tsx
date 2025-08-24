import ReusableDropdown from "@/components/ui/ReusableDropdown";

import { IconSetting } from "@/public/svgs/mentor";

interface FavoriteDropDownProps {
  items: string[];
  handleSelect: (value: string) => void;
}

const FavoriteDropDown = ({ items, handleSelect }: FavoriteDropDownProps) => {
  return (
    <ReusableDropdown items={items} onSelect={handleSelect}>
      <IconSetting />
    </ReusableDropdown>
  );
};

export default FavoriteDropDown;
