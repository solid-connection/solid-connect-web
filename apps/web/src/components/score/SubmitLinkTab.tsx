import clsx from "clsx";
import Link from "next/link";

type SubmitLinkTabProps = {
  isActiveGpa?: boolean;
  variant?: "mobile" | "desktop";
  color?: {
    activeBtn?: string;
    deactiveBtn?: string;
    activeBtnFont?: string;
    deactiveBtnFont?: string;
  };
};

const SubmitLinkTab = ({ color, isActiveGpa = true, variant = "mobile" }: SubmitLinkTabProps) => {
  const defaultColor = {
    activeBtnFont: "text-black",
    deactiveBtnFont: "text-gray-200",
  };
  const combinedColor = {
    activeBtnFont: color?.activeBtnFont ? `text-[${color.activeBtnFont}]` : defaultColor.activeBtnFont,
    deactiveBtnFont: color?.deactiveBtnFont ? `text-[${color.deactiveBtnFont}]` : defaultColor.deactiveBtnFont,
  };

  if (variant === "desktop") {
    return (
      <div className="grid h-11 w-full grid-cols-2 rounded-lg bg-k-50 p-1 typo-medium-2">
        <Link
          href="/university/score/submit/language-test"
          className={clsx(
            "flex items-center justify-center rounded-md transition-colors",
            !isActiveGpa ? "bg-white text-primary shadow-sdwA" : "text-k-500 hover:text-k-700",
          )}
        >
          공인어학
        </Link>
        <Link
          href="/university/score/submit/gpa"
          className={clsx(
            "flex items-center justify-center rounded-md transition-colors",
            isActiveGpa ? "bg-white text-primary shadow-sdwA" : "text-k-500 hover:text-k-700",
          )}
        >
          학점
        </Link>
      </div>
    );
  }

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
