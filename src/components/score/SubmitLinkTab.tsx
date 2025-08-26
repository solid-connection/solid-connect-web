import Link from "next/link";

type SubmitLinkTabProps = {
  color?: {
    activeBtn?: string;
    deactiveBtn?: string;
    activeBtnFont?: string;
    deactiveBtnFont?: string;
  };
};

const SubmitLinkTab = ({ color }: SubmitLinkTabProps) => {
  const defaultColor = {
    activeBtnFont: "#000",
    deactiveBtnFont: "#7D7D7D",
  };
  const combinedColor = { ...defaultColor, ...color };
  return (
    <div className="flex h-9 w-full cursor-pointer flex-row text-sm font-medium">
      <span
        style={{ color: combinedColor.activeBtnFont }}
        className="flex w-full items-center justify-center border-b-2 border-secondary bg-white"
      >
        <div>공인어학</div>
      </span>
      <Link
        href="/score/submit/gpa"
        style={{ color: combinedColor.deactiveBtnFont }}
        className="flex w-full items-center justify-center bg-white"
      >
        <div>학점</div>
      </Link>
    </div>
  );
};
export default SubmitLinkTab;
