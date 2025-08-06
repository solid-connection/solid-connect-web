"use client";

import MentorCard from "@/components/mentor/MentorCard";

import useGetMyMentorProfile from "@/api/mentor/client/useGetMentorMyProfile";

const MyMentorSection = () => {
  const { myMentorProfile } = useGetMyMentorProfile();

  return (
    <>
      <h2 className="text-lg font-bold text-gray-900">나의 멘토 페이지</h2>
      <div className="mt-[14px]">
        <MentorCard key={myMentorProfile?.id} isMine mentor={myMentorProfile} />
      </div>
    </>
  );
};
export default MyMentorSection;
