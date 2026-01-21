import useInfinityScroll from "@/utils/useInfinityScroll";

import MentorExpandChatCard from "@/components/mentor/MentorExpandChatCard";
import EmptySdwBCards from "@/components/ui/EmptySdwBCards";

import { useGetMentoringList } from "@/apis/mentor";

const ApplicantListSection = () => {
  const { data: mentoringApplicantList = [], fetchNextPage, hasNextPage } = useGetMentoringList({ size: 6 });
  const { lastElementRef } = useInfinityScroll({ fetchNextPage, hasNextPage });

  return (
    <>
      {mentoringApplicantList.length === 0 ? (
        <EmptySdwBCards message={"나와 매칭된 멘토입니다"} />
      ) : (
        mentoringApplicantList.map((mentor, index) => (
          <MentorExpandChatCard
            lastElementRef={index === mentoringApplicantList.length - 1 ? lastElementRef : undefined}
            key={mentor.mentoringId}
            message="님이 멘티 신청을 보냈어요."
            {...mentor}
          />
        ))
      )}
    </>
  );
};

export default ApplicantListSection;
