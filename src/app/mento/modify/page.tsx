"use client";

import Image from "next/image";

import { convertISODateToDate } from "@/utils/datetimeUtils";
import { getMyData } from "@/utils/mockingGetData";

import ChannelBadge from "@/components/mentor/ChannelBadge";
import ChannelSelect from "@/components/mentor/ChannelSelect";
import MentoArticle from "@/components/mentor/MentoArticlePanel";
import MentoProfile from "@/components/mentor/MentoProfile";
import MentoStudyStatusBox from "@/components/mentor/MentoStudyStatusBox";

import { ChannelType } from "@/types/mentor";

import { IconUserPrimaryColor } from "@/public/svgs/mentor";

const MentorModifyPage = () => {
  const myData = getMyData();
  const { profileImageUrl, hasBadge, menteeCount, nickname, country, universityName, studyStatus } = myData;

  const formattedDate = convertISODateToDate(new Date().toISOString());

  // 폼 제출 핸들러
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO 여기에 폼 제출 로직을 추가
    console.log("폼이 제출되었습니다.");
  };

  return (
    <div className="min-h-screen px-4">
      <form onSubmit={handleSubmit}>
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
          </div>
          <h2 className="mt-[6px] text-[17px] font-semibold leading-normal text-k-800">교환학생 찐 후기</h2>
          <p className="text-sm font-normal text-k-500">
            교환학생 경험의 진솔한 이야기와 꿀팁이 가득한 &apos;찐&apos; 후기를 영상에서 확인하세요!
          </p>
          <MentoArticle />

          <div className="mt-10 flex justify-center">
            <button className="mb-10 h-[40px] w-[150px] rounded-3xl bg-primary-1 px-5 py-[10px] text-k-0">
              수정하기
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default MentorModifyPage;
