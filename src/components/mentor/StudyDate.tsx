import clsx from "clsx";

interface StudyDateProps {
  studyStatus: "24-1" | "24-2";
}

const StudyDate = ({ studyStatus }: StudyDateProps) => {
  return (
    <div
      className={clsx(
        "flex h-6 w-fit items-center justify-center gap-2.5 rounded px-2 py-px text-center text-xs font-semibold leading-[150%]",
        studyStatus === "24-1"
          ? "bg-sub-e-100 text-sub-e-500"
          : studyStatus === "24-2"
            ? "bg-sub-c-100 text-sub-c-500"
            : "bg-gray-100 text-gray-700",
      )}
    >
      {studyStatus}
    </div>
  );
};

export default StudyDate;
