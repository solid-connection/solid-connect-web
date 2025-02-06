import { IconMyMenuArrow } from "@/public/svgs/my";

type MyMenuProps = {
  text: string;
  isArrowVisible?: boolean;
  isBold?: boolean;
};

const MyMenu = ({ text, isArrowVisible = true, isBold = false }: MyMenuProps) => (
  <div className="flex h-[30px] items-center justify-between pl-8 pr-10" role="button">
    <span className={`text-sm leading-normal ${isBold ? "font-medium" : "font-normal"} text-k-800`}>{text}</span>
    {isArrowVisible && <IconMyMenuArrow />}
  </div>
);

export default MyMenu;
