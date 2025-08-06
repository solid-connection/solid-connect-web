"use client";

import clsx from "clsx";

import ChannelBadge from "@/components/ui/ChannelBadge";
import ProfileWithBadge from "@/components/ui/ProfileWithBadge";

import MentorArticle from "./_ui/MentorArticle";

import { ChannelType } from "@/types/mentor";

import useGetArticleList from "@/api/article/client/useGetArticleList";
import useGetMentorDetail from "@/api/mentors/client/useGetMentorDetail";
import { customConfirm } from "@/lib/zustand/useConfirmModalStore";
import { IconCheck } from "@/public/svgs/mentor";

interface MentorDetailContentProps {
  mentorId: number;
}

const MentorDetialContent = ({ mentorId }: MentorDetailContentProps) => {
  const { data } = useGetMentorDetail(mentorId);
  const { articleList } = useGetArticleList(mentorId);

  const onClick = async () => {
    const ok = await customConfirm({
      title: "멘토 신청",
      content: "멘토 신청을 하시겠습니까?",
      icon: IconCheck,
      rejectMessage: "취소",
      approveMessage: "멘토 신청",
    });
    if (!ok) return;
  };

  if (!data) return null; // type guard

  const {
    country,
    studyStatus,
    nickname,
    universityName,
    introduction,
    channels,
    passTip,
    hasBadge,
    profileImageUrl,
    menteeCount, //현재 멘티 카운트는 보여주지 않음
    isApplied,
  } = data;

  return (
    <>
      {/* 멘토 프로필 섹션 */}
      <div className="mt-2 flex">
        {/* 프로필 이미지 */}
        <ProfileWithBadge
          width={86}
          height={86}
          hasBadge={hasBadge}
          isBadgeUp={false}
          profileImageUrl={profileImageUrl}
        />
        <div className="ml-6 flex flex-col justify-start">
          {/* 국가 및 학교 정보 */}
          <div className="mb-2 flex items-center gap-2">
            <span className="text-[14px] font-semibold text-primary">{country}</span>
            {studyStatus && <span className="text-[14px] font-medium text-secondary-500">{studyStatus} 멘토</span>}
            {!studyStatus &&
              // TODO: studyStatus 없을 때 처리 필요
              null}
          </div>

          {/* 멘토 이름 */}
          <h1 className="mb-2 text-xl font-semibold text-k-900">{nickname}님</h1>

          {/* 학교 및 전공 */}
          <p className="mb-2 text-center text-base text-k-500">{universityName}</p>

          {/* 연락 가능 시간 */}
          <p className="text-sm font-semibold text-k-800">방해 금지 시간</p>
          <p className="text-sm font-normal text-k-500">0:00 ~ 8:00</p>
        </div>
      </div>
      <hr className="mb-[30px] mt-[30px]" />

      {/* 멘토 한마디 */}
      <h3 className="mb-2 text-[18px] font-normal text-secondary">멘토 한마디</h3>
      <p className="mb-7 text-[14px] font-normal text-k-500">{introduction}</p>

      {/* 멘토 채널 */}
      <h3 className="mb-2 text-[18px] font-normal text-secondary">멘토 한마디</h3>
      <div className="mb-7">
        <div
          className={`grid gap-2 ${
            channels.length === 1
              ? "grid-cols-1"
              : channels.length === 2
                ? "grid-cols-2"
                : channels.length === 3
                  ? "grid-cols-2"
                  : "grid-cols-2"
          }`}
        >
          {channels.map((channel, idx) => (
            <div
              key={idx}
              className={`h-[40px] ${channels.length === 1 ? "w-full" : channels.length === 3 && idx === 2 ? "col-span-2" : ""}`}
            >
              <ChannelBadge channerType={channel.type as ChannelType} />
            </div>
          ))}
        </div>
      </div>

      {/* 합격 레시피 */}
      <h3 className="mb-2 text-[18px] font-normal text-secondary">합격 레시피</h3>
      {passTip ? (
        <p className="mb-7 text-[14px] font-normal text-k-500">{passTip}</p>
      ) : (
        // TODO: passTip 없을 때 처리 필요
        <p className="mb-7 text-[14px] font-normal text-k-500">정보가 없습니다.</p>
      )}

      {/* 멘토의 아티클 */}
      <h3 className="mb-2 text-[18px] font-normal text-secondary">멘토의 아티클</h3>
      <div className="mb-6 space-y-4">
        {articleList.map((article) => (
          <MentorArticle key={article.title} article={article} />
        ))}
      </div>
      <div className="pointer-events-none fixed bottom-20 left-0 right-0 flex justify-center">
        <div className="pointer-events-auto w-full max-w-md px-4">
          <button
            type="button"
            onClick={onClick}
            disabled={isApplied}
            className={clsx(
              "flex h-[41px] w-full items-center justify-center gap-3 rounded-[20px] px-5 py-[10px] font-medium",
              {
                "cursor-not-allowed bg-k-100 text-k-400": isApplied,
                "bg-primary text-white": !isApplied,
              },
            )}
          >
            {isApplied ? "매칭완료된 멘토" : "멘토 신청하기"}
          </button>
        </div>
      </div>
    </>
  );
};
export default MentorDetialContent;
