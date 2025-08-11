import useInfinityScroll from "@/utils/useInfinityScroll";

import MentorChatCard from "@/components/mentor/MentorChatCard";
import EmptySdwBCards from "@/components/ui/EmptySdwBCards";

import useGetMentoringList from "@/api/mentor/client/useGetMentoringList";

const ApplicantListSection = () => {
  const { data: mentoringApplicantList = [], fetchNextPage } = useGetMentoringList({ size: 6 });
  const { lastElementRef } = useInfinityScroll(fetchNextPage);

  return (
    <>
      {mentoringApplicantList.length === 0 ? (
        <EmptySdwBCards message={"나와 매칭된 멘토입니다"} />
      ) : (
        mentoringApplicantList.map((mentor, index) => (
          <div key={mentor.mentoringId} ref={mentoringApplicantList.length === index + 1 ? lastElementRef : null}>
            <MentorChatCard
              key={mentor.mentoringId}
              profileImageUrl={mentor.profileImageUrl}
              nickname={mentor.nickname}
              description={""}
            />
          </div>
        ))
      )}
    </>
  );
};
export default ApplicantListSection;
