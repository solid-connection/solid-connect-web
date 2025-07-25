import MenteePageTabs from "./_ui/MenteePageTabs";
import MentorFindSection from "./_ui/MentorFindSection";
import MentorPageTabs from "./_ui/MentorPageTabs";
import MyMentorSection from "./_ui/MyMentorSection";

const MentorClient = () => {
  const isMentor = false;
  return (
    <>
      {!isMentor ? (
        // 멘토페이지
        <>
          {/* 나의 멘토 - 멘티 탭 및 채팅카드 */}
          <MentorPageTabs />
          {/* 나의 멘토 페이지 */}
          <MyMentorSection />
        </>
      ) : (
        // 멘티페이지
        <>
          {/* 탭 및 나의 멘토 , 멘티요청 리스트 채팅카드 */}
          <MenteePageTabs />
          {/* 멘토찾기 섹션 */}
          <MentorFindSection />
        </>
      )}
    </>
  );
};

export default MentorClient;
