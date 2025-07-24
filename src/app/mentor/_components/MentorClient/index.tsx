import MenteePageTabs from "./_components/MenteePageTabs";
import MentorFindSection from "./_components/MentorFindSection";
import MentoPageTabs from "./_components/MentorPageTabs";
import MyMentoSection from "./_components/MyMentoSection";

const MentorClient = () => {
  const isMentor = false;
  return (
    <>
      {!isMentor ? (
        // 멘토페이지
        <>
          {/* 나의 멘토 - 멘티 탭 및 채팅카드 */}
          <MentoPageTabs />
          {/* 나의 멘토 페이지 */}
          <MyMentoSection />
        </>
      ) : (
        // 멘티페이지
        <>
          {/* 탭 및 나의 멘토 , 멘티요청 리스트 채팅카드 */}
          <MenteePageTabs />
          {/* 중간 밑줄 */}
          <div className="mb-10 mt-10 h-1.5 w-full bg-k-50"></div>
          {/* 멘토찾기 섹션 */}
          <MentorFindSection />
        </>
      )}
    </>
  );
};

export default MentorClient;
