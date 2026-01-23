"use client";

import { useGetMentorMyProfile } from "@/apis/mentor";
import MentorCard from "@/components/mentor/MentorCard";

const MyMentorSection = () => {
  const { data: myMentorProfile } = useGetMentorMyProfile();

  if (!myMentorProfile) {
    return <div className="text-gray-500">멘토 프로필을 불러오는 중...</div>;
  }

  return (
    <>
      <h2 className="text-gray-900 typo-bold-5">나의 멘토 페이지</h2>
      <div className="mt-[14px]">
        <MentorCard key={myMentorProfile?.id} isMine mentor={myMentorProfile} />
      </div>
    </>
  );
};
export default MyMentorSection;
