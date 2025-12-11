"use client";

import MentorCard from "@/components/mentor/MentorCard";

import useGetMyMentorProfile from "@/api/mentor/client/useGetMentorMyProfile";

const MyMentorSection = () => {
  const { data: myMentorProfile } = useGetMyMentorProfile();

  if (!myMentorProfile) {
    return <div className="text-gray-500">멘토 프로필을 불러오는 중...</div>;
  }

  return (
    <>
      <h2 className="typo-bold-5 text-gray-900">나의 멘토 페이지</h2>
      <div className="mt-[14px]">
        <MentorCard key={myMentorProfile?.id} isMine mentor={myMentorProfile} />
      </div>
    </>
  );
};
export default MyMentorSection;
