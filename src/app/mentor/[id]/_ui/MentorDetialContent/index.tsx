"use client";

import clsx from "clsx";
import Link from "next/link";
import { useGetMentorDetail, usePostApplyMentoring } from "@/apis/mentor";
import { useGetArticleList } from "@/apis/news";
import StudyDate from "@/components/mentor/StudyDate";
import ChannelBadge from "@/components/ui/ChannelBadge";
import ProfileWithBadge from "@/components/ui/ProfileWithBadge";
import type { ChannelType } from "@/types/mentor";
import MentorArticle from "./_ui/MentorArticle";

interface MentorDetailContentProps {
  mentorId: number;
}

const MentorDetialContent = ({ mentorId }: MentorDetailContentProps) => {
  const { data: mentorDetail } = useGetMentorDetail(mentorId);
  const { data: articleList = [] } = useGetArticleList(mentorId);
  const { mutate: postApplyMentoring } = usePostApplyMentoring();

  if (!mentorDetail) return null; // type guard

  const {
    id,
    profileImageUrl,
    nickname,
    country,
    universityName,
    hasBadge,
    introduction,
    channels,
    passTip,
    isApplied,
    term,
  } = mentorDetail;

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
          <div className="mb-2 flex items-center gap-4">
            <span className="text-primary typo-sb-9">{country}</span>
            <StudyDate term={term} />
          </div>

          {/* 멘토 이름 */}
          <h1 className="mb-2 text-k-900 typo-sb-4">{nickname}님</h1>

          {/* 학교  */}
          <p className="mb-2 text-k-500 typo-regular-1">{universityName}</p>

          {/* 연락 가능 시간 */}
          {/* <p className="text-sm font-semibold text-k-800">방해 금지 시간</p> */}
          {/* <p className="text-sm font-normal text-k-500">0:00 ~ 8:00</p> */}
        </div>
      </div>
      <hr className="mb-[30px] mt-[30px]" />

      {/* 멘토 한마디 */}
      <h3 className="mb-2 text-secondary typo-regular-1">멘토 한마디</h3>
      <p className="mb-7 text-k-500 typo-regular-2">{introduction}</p>

      {/* 멘토 채널 */}
      <h3 className="mb-2 text-secondary typo-regular-1">멘토 한마디</h3>
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
            <Link
              rel={"noopener noreferrer"}
              href={channel.url}
              target="_blank"
              key={idx}
              className={`h-[40px] ${channels.length === 1 ? "w-full" : channels.length === 3 && idx === 2 ? "col-span-2" : ""}`}
            >
              <ChannelBadge channelType={channel.type as ChannelType} />
            </Link>
          ))}
        </div>
      </div>

      {/* 합격 레시피 */}
      <h3 className="mb-2 text-secondary typo-regular-1">합격 레시피</h3>
      {passTip ? (
        <p className="mb-7 text-k-500 typo-regular-2">{passTip}</p>
      ) : (
        // TODO: passTip 없을 때 처리 필요
        <p className="mb-7 text-k-500 typo-regular-2">정보가 없습니다.</p>
      )}

      {/* 멘토의 아티클 */}
      <h3 className="mb-2 text-secondary typo-regular-1">멘토의 아티클</h3>
      <div className="mb-6 space-y-4">
        {articleList.map((article) => (
          <MentorArticle key={article.title} article={article} mentorId={mentorId} />
        ))}
        {articleList.length === 0 && <p className="mb-7 text-k-500 typo-regular-2">정보가 없습니다.</p>}
      </div>
      <div className="pointer-events-none fixed bottom-20 left-1/2 flex w-full -translate-x-1/2 justify-center">
        <div className="pointer-events-auto w-1/2 max-w-md px-4">
          <button
            type="button"
            onClick={() => postApplyMentoring({ mentorId: id })}
            disabled={isApplied}
            className={clsx(
              "flex h-10 w-full items-center justify-center gap-3 rounded-[20px] px-5 py-[10px] typo-medium-2",
              {
                "cursor-not-allowed bg-k-100 text-k-400": isApplied,
                "bg-primary text-white": !isApplied,
              },
            )}
          >
            {"멘토 신청하기"}
          </button>
        </div>
      </div>
    </>
  );
};
export default MentorDetialContent;
