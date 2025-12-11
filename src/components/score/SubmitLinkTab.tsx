import Link from "next/link";

import clsx from "clsx";

type SubmitLinkTabProps = {
  isActiveGpa?: boolean;
  color?: {
    activeBtn?: string;
    deactiveBtn?: string;
    activeBtnFont?: string;
    deactiveBtnFont?: string;
  };
};

const SubmitLinkTab = ({ color, isActiveGpa = true }: SubmitLinkTabProps) => {
  const defaultColor = {
    activeBtnFont: "text-black",
    deactiveBtnFont: "text-gray-200",
  };
  const combinedColor = {
    activeBtnFont: color?.activeBtnFont ? `text-[${color.activeBtnFont}]` : defaultColor.activeBtnFont,
    deactiveBtnFont: color?.deactiveBtnFont ? `text-[${color.deactiveBtnFont}]` : defaultColor.deactiveBtnFont,
  };
  return (
    <div className="flex h-9 w-full cursor-pointer flex-row typo-medium-2">
      <Link
        href="/university/score/submit/language-test"
        className={clsx(
          "flex w-full items-center justify-center border-b-2 border-b-primary-500 bg-white",
          !isActiveGpa ? "border-b-primary-500" : "border-b-transparent",
          !isActiveGpa ? combinedColor.activeBtnFont : combinedColor.deactiveBtnFont,
        )}
      >
        <div>공인어학</div>
      </Link>
      <Link
        href="/university/score/submit/gpa"
        className={clsx(
          "flex w-full items-center justify-center border-b-2 border-b-primary-500 bg-white",
          isActiveGpa ? "border-b-primary-500" : "border-b-transparent",
          isActiveGpa ? combinedColor.activeBtnFont : combinedColor.deactiveBtnFont,
        )}
      >
        <div>학점</div>
      </Link>
    </div>
  );
};
export default SubmitLinkTab;
