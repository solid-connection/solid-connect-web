import clsx from "clsx";

interface StudyDateProps {
  term: string;
}

const StudyDate = ({ term }: StudyDateProps) => {
  const isYellow = term.split("-")[1] === "1";
  const isGreen = term.split("-")[1] === "2";
  return (
    <div
      className={clsx(
        "flex h-6 w-fit items-center justify-center gap-2.5 rounded px-2 py-px text-center text-xs font-semibold leading-[150%]",
        isGreen
          ? "bg-sub-e-100 text-sub-e-500"
          : isYellow
            ? "bg-sub-c-100 text-sub-c-500"
            : "bg-gray-100 text-gray-700",
      )}
    >
      {`${term}학기 파견 `}
    </div>
  );
};

export default StudyDate;
