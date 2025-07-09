"use client";

import Image from "next/image";

import ChannelBadge from "@/components/mentor/ChannelBadge";
import ChannelSelect from "@/components/mentor/ChannelSelect";
import MentoProfile from "@/components/mentor/MentoProfile";
import MentoStudyStatusBox from "@/components/mentor/MentoStudyStatusBox";
import ToolTipMessage from "@/components/ui/TooltipMessage";

import { ChannelType, Mentor, MentorStudyStatus } from "@/types/mentor";

import { IconPencil, IconUserPrimaryColor } from "@/public/svgs/mentor";

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

  const today = new Date();
  const formattedDate = today.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

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
        <h2 className="mb-[10px] text-lg leading-normal text-primary-1">내 채널 관리</h2>
        {/* 채널타입으로 뱃지 색상 구분 */}
        {Object.values(ChannelType).map((channelType, index) => (
          <div key={index} className="mb-6">
            <div className="flex h-[26px] w-[70px] items-center justify-center overflow-hidden rounded-2xl">
              <ChannelBadge channerType={channelType} text={`내 채널${index + 1}`} />
            </div>
            <h2 className="mt-[10px] text-[16px] font-medium text-k-700">채널 선택</h2>
            <ChannelSelect name={`channel-${index}`} />

            <h2 className="mt-5 text-[16px] font-medium text-k-700">링크 삽입</h2>
            <input
              className="mt-2 h-[45px] w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-light text-k-300"
              placeholder="링크를 입력해주세요."
            />
          </div>
        ))}
        <h2 className="mt-[40px] text-lg leading-normal text-primary-1">멘토 한마디</h2>
        <textarea
          className="mt-[10px] h-[120px] w-full rounded-lg bg-k-50 p-5 text-sm font-light text-k-300"
          placeholder="최대 200자 이내"
        />
        <h2 className="mt-[40px] text-lg leading-normal text-primary-1">합격 레시피</h2>
        <textarea
          className="mt-[10px] h-[120px] w-full rounded-lg bg-k-50 p-5 text-sm font-light text-k-300"
          placeholder="최대 200자 이내"
        />
        <h2 className="mt-[40px] text-lg leading-normal text-primary-1">멘토 아티클</h2>
        <div className="relative h-[200px] w-full">
          <Image src="/images/article-thumb.png" alt="멘토 아티클 이미지" fill className="object-cover" />
        </div>
        <div className="mt-[10px] flex justify-between">
          <div className="text-[13px] font-medium text-k-500">{formattedDate}</div>
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary-500">
            <div className="h-[10px w-[10px]">
              <IconPencil />
            </div>
          </div>
        </div>
        <h2 className="mt-[6px] text-[17px] font-semibold leading-normal text-k-800">교환학생 찐 후기</h2>
        <p className="text-sm font-normal text-k-500">
          교환학생 경험의 진솔한 이야기와 꿀팁이 가득한 &apos;찐&apos; 후기를 영상에서 확인하세요!
        </p>
        <div className="mt-[10px] flex h-[160px] flex-col items-center justify-center bg-k-50">
          <div className="flex w-full flex-1 items-center justify-center">
            <div className="relative flex h-[39px] w-2/3 items-center justify-center gap-2 rounded-lg bg-k-100 text-sm font-medium text-k-500">
              <span className="text-lg">+</span>
              새로운 아티클 추가하기
              <div className="absolute left-0 top-full mt-2 w-full">
                <ToolTipMessage
                  message={`아티클을 추가해서 내 채널 \n 유입률을 높여보세요!`}
                  bgColor="secondary"
                  textColor="k-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MentorModifyPage;
