"use client";

import ChannelBadge from "@/components/mentor/ChannelBadge";
import ChannelSelect from "@/components/mentor/ChannelSelect";
import MentoProfile from "@/components/mentor/MentoProfile";
import MentoStudyStatusBox from "@/components/mentor/MentoStudyStatusBox";

import { ChannelType, Mentor, MentorStudyStatus } from "@/types/mentor";

import { IconUserPrimaryColor } from "@/public/svgs/mentor";

const myData: Mentor = {
  id: 1,
  profileImageUrl: undefined,
  nickname: "윤솔거",
  country: "미국",
  universityName: "노스캐롤라이나 윌컴턴대학교(A형)",
  studyStatus: MentorStudyStatus.STUDYING,
  menteeCount: 0,
  hasBadge: false,
  introduction: "안녕하세요! 교환학생에 대해 무엇이든 물어보세요!",
  channels: [
    { type: ChannelType.BLOG, url: "https://blog.example.com" },
    { type: ChannelType.BRUNCH, url: "https://brunch.example.com" },
  ],
  isApplied: false,
};
const getMyData = () => {
  return myData;
};

const MentorModifyPage = () => {
  const myData = getMyData();
  const { profileImageUrl, hasBadge, menteeCount, nickname, country, universityName, studyStatus } = myData;

  return (
    <div className="min-h-screen px-4">
      {/* Profile Header */}
      <div className="gap-4">
        <h1 className="text-lg font-semibold text-gray-900">나의 멘토</h1>
        <div className="flex gap-4">
          <div className="flex flex-col items-start gap-2">
            <MentoProfile profileImageUrl={profileImageUrl} hasBadge={hasBadge} />
            <div className="flex items-center gap-2 text-sm leading-normal text-primary">
              <span className="h-[16px] w-[16px]">
                <IconUserPrimaryColor />
              </span>
              누적 멘티 : {menteeCount}
            </div>
          </div>
          <div className="flex flex-col gap-[8px]">
            <div className="text-sm text-gray-500">{country}</div>
            <div className="text-lg font-semibold text-gray-900">{nickname}</div>
            <div className="text-sm text-gray-500">{universityName}</div>
            <MentoStudyStatusBox studyStatus={studyStatus} />
          </div>
        </div>
      </div>
      <div className="mt-[40px]">
        <h2 className="text-lg leading-normal text-primary-1">내 채널 관리</h2>
        {/* 채널타입으로 뱃지 색상 구분 */}
        {Object.values(ChannelType).map((channelType, index) => (
          <div key={index} className="mb-6">
            <div className="mb-3 flex h-[26px] w-[70px] items-center justify-center overflow-hidden rounded-2xl">
              <ChannelBadge channerType={channelType} text={`내 채널${index + 1}`} />
            </div>

            <ChannelSelect name={`channel-${index}`} />

            <h2 className="mt-4 text-[16px] font-medium text-k-700">링크 삽입</h2>
            <input
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="링크를 입력해주세요."
            />
          </div>
        ))}
      </div>
    </div>
  );
};
export default MentorModifyPage;
