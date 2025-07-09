import { MentorStudyStatus } from "@/types/mentor";

interface MentorStudyStatusBoxProps {
  studyStatus: MentorStudyStatus;
}

const MentorStudyStatusBox = ({ studyStatus }: MentorStudyStatusBoxProps) => {
  const getStatusStyle = () => {
    switch (studyStatus) {
      case MentorStudyStatus.STUDYING:
        return "bg-secondary-100 text-secondary"; // var(--S100, #E8EDFD) & var(--Secondary-Color, #4672EE)
      case MentorStudyStatus.SCHEDULED:
        return "bg-sub-c-100 text-sub-c-500"; // var(--SubC100, #FFF2DD) & var(--SubC500, #FF934B)
      case MentorStudyStatus.COMPLETED:
        return "bg-sub-d-100 text-sub-d-500"; // var(--SubD100, #FCEFFF) & var(--SubD500, #B33BD4)
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div
      className={`flex h-6 w-fit items-center justify-center gap-[10px] rounded px-2 py-[3px] text-center text-xs font-semibold leading-[150%] ${getStatusStyle()}`}
    >
      {studyStatus}
    </div>
  );
};

export default MentorStudyStatusBox;
