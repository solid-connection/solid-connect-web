import { IconMyMenuArrow } from "@/public/svgs/my";

type MyMenuProps = {
  text: string;
  isArrowVisible?: boolean;
  isBold?: boolean;
};

const MyMenu = ({ text, isArrowVisible = true, isBold = false }: MyMenuProps) => {
  return (
    <div className="flex h-10 items-center justify-between pl-7 pr-7" role="button">
      <span className={`font-serif text-sm ${isBold ? "font-medium" : "font-normal"} text-black`}>{text}</span>
      {isArrowVisible && <IconMyMenuArrow />}
    </div>
  );
};

export default MyMenu;
