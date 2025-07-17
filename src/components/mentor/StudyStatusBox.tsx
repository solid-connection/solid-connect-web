import { MentorStudyStatus } from "@/types/mentor";

interface StudyStatusBoxProps {
  studyStatus: MentorStudyStatus;
}

const StudyStatusBox = ({ studyStatus }: StudyStatusBoxProps) => {
  return (
    <div
      className={`flex h-6 w-fit items-center justify-center gap-[10px] rounded px-2 py-[3px] text-center text-xs font-semibold leading-[150%] ${
        studyStatus === MentorStudyStatus.STUDYING
          ? "bg-secondary-100 text-secondary"
          : studyStatus === MentorStudyStatus.SCHEDULED
            ? "bg-sub-c-100 text-sub-c-500"
            : studyStatus === MentorStudyStatus.COMPLETED
              ? "bg-sub-d-100 text-sub-d-500"
              : "bg-gray-100 text-gray-700"
      }`}
    >
      {studyStatus}
    </div>
  );
};

export default StudyStatusBox;
