import useInfinityScroll from "@/utils/useInfinityScroll";

import MentorExpandChatCard from "@/components/mentor/MentorExpandChatCard";
import EmptySdwBCards from "@/components/ui/EmptySdwBCards";

import usePatchApprovalStatusHandler from "./_hooks/usePatchApprovalStatusHandler";

import useGetMentoringList from "@/api/mentor/client/useGetMentoringList";
import usePatchMentoring from "@/api/mentor/client/usePatchMentoring";

const ApplicantListSection = () => {
  const { data: mentoringApplicantList = [], fetchNextPage, hasNextPage } = useGetMentoringList({ size: 6 });
  const { lastElementRef } = useInfinityScroll({ fetchNextPage, hasNextPage });
  const { mutate: patchMentoring } = usePatchMentoring();

  const { handleAccept, handleReject } = usePatchApprovalStatusHandler();

  return (
    <>
      {mentoringApplicantList.length === 0 ? (
        <EmptySdwBCards message={"나와 매칭된 멘토입니다"} />
      ) : (
        mentoringApplicantList.map((mentor, index) => (
          <button
            className="w-full"
            onClick={() => patchMentoring({ checkedMentoringIds: [mentor.mentoringId] })}
            key={mentor.mentoringId}
            ref={mentoringApplicantList.length === index + 1 ? lastElementRef : null}
          >
            <MentorExpandChatCard
              hasExpand={true}
              profileImageUrl={mentor.profileImageUrl}
              nickname={mentor.nickname}
              date={mentor.createdAt}
              message="님이 멘티 신청을 보냈어요"
              mentoringId={mentor.mentoringId}
              isChecked={mentor.isChecked}
              showApprovalButtons={true}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          </button>
        ))
      )}
    </>
  );
};
export default ApplicantListSection;
