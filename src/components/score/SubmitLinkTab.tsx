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
    activeBtnFont: "#000",
    deactiveBtnFont: "#7D7D7D",
  };
  const combinedColor = { ...defaultColor, ...color };
  return (
    <div className="flex h-9 w-full cursor-pointer flex-row text-sm font-medium">
      <Link
        href="/university/score/submit/language-test"
        style={{ color: combinedColor.activeBtnFont }}
        className={clsx(
          "flex w-full items-center justify-center border-b-2 border-b-primary-500 bg-white",
          !isActiveGpa ? "border-b-primary-500" : "border-b-transparent",
        )}
      >
        <div>공인어학</div>
      </Link>
      <Link
        href="/university/score/submit/gpa"
        style={{ color: combinedColor.deactiveBtnFont }}
        className={clsx(
          "flex w-full items-center justify-center border-b-2 border-b-primary-500 bg-white",
          isActiveGpa ? "border-b-primary-500" : "border-b-transparent",
        )}
      >
        <div>학점</div>
      </Link>
    </div>
  );
};
export default SubmitLinkTab;
