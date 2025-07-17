import { Metadata } from "next";

import { getMentorData } from "@/utils/mockingGetData";

import MentorCard from "@/components/mentor/MentorCard";

import MenteePageTabs from "./_components/MenteePageTabs";
import MentorFindSection from "./_components/MentorFindSection";
import MentoPageTabs from "./_components/MentorPageTabs";

export const metadata: Metadata = {
  title: "멘토",
  description: "멘토 멘티 페이지",
};

const MentorPage = () => {
  const isMentor = false;
  const myMentoData = getMentorData();

  return (
    <>
      {isMentor ? (
        // 멘토페이지
        <>
          {/* 나의 멘토 - 멘티 탭 및 채팅카드 */}
          <MentoPageTabs />
          {/* 나의 멘토 페이지 */}
          <h2 className="text-lg font-bold text-gray-900">나의 멘토 페이지</h2>
          <div className="mt-[14px]">
            {myMentoData.map((mentee) => (
              <MentorCard key={mentee.id} isMine mentor={mentee} />
            ))}
          </div>
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

export default MentorPage;
