"use client";

import clsx from "clsx";
import Link from "next/link";
import type { ReactNode } from "react";
import { useGetMentorDetail, usePostApplyMentoring } from "@/apis/mentor";
import { useGetArticleList } from "@/apis/news";
import StudyDate from "@/components/mentor/StudyDate";
import ChannelBadge from "@/components/ui/ChannelBadge";
import ProfileWithBadge from "@/components/ui/ProfileWithBadge";
import type { ChannelType } from "@/types/mentor";
import useIsDesktopViewport from "@/utils/useIsDesktopViewport";
import MentorArticle from "./_ui/MentorArticle";

interface MentorDetailContentProps {
  mentorId: number;
}

const MentorDetialContent = ({ mentorId }: MentorDetailContentProps) => {
  const { data: mentorDetail } = useGetMentorDetail(mentorId);
  const { data: articleList = [] } = useGetArticleList(mentorId);
  const { mutate: postApplyMentoring } = usePostApplyMentoring();
  const isDesktop = useIsDesktopViewport();

  if (!mentorDetail || isDesktop === null) return null; // type guard

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
  const handleApplyMentoring = () => postApplyMentoring({ mentorId: id });

  const profileSummary = (
    <>
      <div className="flex items-start gap-6">
        <ProfileWithBadge
          width={86}
          height={86}
          hasBadge={hasBadge}
          isBadgeUp={false}
          profileImageUrl={profileImageUrl}
        />
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <span className="text-primary typo-sb-9">{country}</span>
            <StudyDate term={term} />
          </div>
          <h1 className="mb-2 text-k-900 typo-sb-4">{nickname}님</h1>
          <p className="text-k-500 typo-regular-1">{universityName}</p>
        </div>
      </div>
    </>
  );

  const viewProps: MentorDetailViewProps = {
    mentorId,
    articleList,
    channels,
    profileSummary,
    introduction,
    passTip,
    isApplied,
    handleApplyMentoring,
  };

  return isDesktop ? <DesktopMentorDetailView {...viewProps} /> : <MobileMentorDetailView {...viewProps} />;
};

type MentorDetailViewProps = {
  mentorId: number;
  articleList: NonNullable<ReturnType<typeof useGetArticleList>["data"]>;
  channels: Array<{ type: ChannelType; url: string }>;
  profileSummary: ReactNode;
  introduction: string;
  passTip?: string | null;
  isApplied: boolean;
  handleApplyMentoring: () => void;
};

const DesktopMentorDetailView = ({
  mentorId,
  articleList,
  channels,
  profileSummary,
  introduction,
  passTip,
  isApplied,
  handleApplyMentoring,
}: MentorDetailViewProps) => (
  <div className="min-h-screen bg-k-50 px-8 py-8 lg:px-10">
    <header className="mb-8">
      <p className="text-primary typo-sb-9">Mentor</p>
      <h1 className="mt-2 text-k-900 typo-bold-1">멘토 상세</h1>
      <p className="mt-2 max-w-2xl text-k-500 typo-medium-2">
        멘토의 파견 경험과 아티클을 확인하고 멘토링을 신청하세요.
      </p>
    </header>

    <div className="grid items-start gap-8 xl:grid-cols-[minmax(320px,420px)_minmax(0,1fr)]">
      <aside className="sticky top-8 rounded-lg border border-k-100 bg-white p-6">
        {profileSummary}

        <div className="my-6 h-px bg-k-100" />

        <h2 className="mb-3 text-secondary typo-sb-7">멘토 채널</h2>
        <ChannelLinks channels={channels} />

        <button
          type="button"
          onClick={handleApplyMentoring}
          disabled={isApplied}
          className={getApplyButtonClassName(isApplied, "mt-6")}
        >
          멘토 신청하기
        </button>
      </aside>

      <main className="grid gap-5">
        <DesktopInfoPanel title="멘토 한마디">
          <p className="whitespace-pre-wrap text-k-700 typo-regular-2">{introduction}</p>
        </DesktopInfoPanel>

        <DesktopInfoPanel title="합격 레시피">
          <p className="whitespace-pre-wrap text-k-700 typo-regular-2">{passTip || "정보가 없습니다."}</p>
        </DesktopInfoPanel>

        <DesktopInfoPanel title="멘토의 아티클">
          <div className="grid gap-5 lg:grid-cols-2">
            {articleList.map((article) => (
              <MentorArticle key={article.title} article={article} mentorId={mentorId} />
            ))}
          </div>
          {articleList.length === 0 && <p className="text-k-500 typo-regular-2">정보가 없습니다.</p>}
        </DesktopInfoPanel>
      </main>
    </div>
  </div>
);

const MobileMentorDetailView = ({
  mentorId,
  articleList,
  channels,
  profileSummary,
  introduction,
  passTip,
  isApplied,
  handleApplyMentoring,
}: MentorDetailViewProps) => (
  <>
    <div className="mt-2 flex">{profileSummary}</div>
    <hr className="mb-[30px] mt-[30px]" />

    <h3 className="mb-2 text-secondary typo-regular-1">멘토 한마디</h3>
    <p className="mb-7 text-k-500 typo-regular-2">{introduction}</p>

    <h3 className="mb-2 text-secondary typo-regular-1">멘토 채널</h3>
    <div className="mb-7">
      <ChannelLinks channels={channels} />
    </div>

    <h3 className="mb-2 text-secondary typo-regular-1">합격 레시피</h3>
    {passTip ? (
      <p className="mb-7 text-k-500 typo-regular-2">{passTip}</p>
    ) : (
      <p className="mb-7 text-k-500 typo-regular-2">정보가 없습니다.</p>
    )}

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
          onClick={handleApplyMentoring}
          disabled={isApplied}
          className={getApplyButtonClassName(isApplied)}
        >
          멘토 신청하기
        </button>
      </div>
    </div>
  </>
);

const getApplyButtonClassName = (isApplied: boolean, className?: string) =>
  clsx(
    "flex h-10 w-full items-center justify-center gap-3 rounded-[20px] px-5 py-[10px] typo-medium-2",
    {
      "cursor-not-allowed bg-k-100 text-k-400": isApplied,
      "bg-primary text-white": !isApplied,
    },
    className,
  );

const getChannelLinkClassName = (channelCount: number, index: number) =>
  clsx("h-[40px]", {
    "w-full": channelCount === 1,
    "col-span-2": channelCount === 3 && index === 2,
  });

const ChannelLinks = ({ channels }: { channels: Array<{ type: ChannelType; url: string }> }) => (
  <div className={clsx("grid gap-2", channels.length === 1 ? "grid-cols-1" : "grid-cols-2")}>
    {channels.map((channel, idx) => (
      <Link
        rel="noopener noreferrer"
        href={channel.url}
        target="_blank"
        key={`${channel.type}-${channel.url}`}
        className={getChannelLinkClassName(channels.length, idx)}
      >
        <ChannelBadge channelType={channel.type} />
      </Link>
    ))}
  </div>
);

const DesktopInfoPanel = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="rounded-lg border border-k-100 bg-white p-6">
    <h2 className="mb-4 text-secondary typo-sb-7">{title}</h2>
    {children}
  </section>
);

export default MentorDetialContent;
