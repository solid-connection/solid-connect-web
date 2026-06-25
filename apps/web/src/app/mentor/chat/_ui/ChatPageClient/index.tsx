"use client";

import clsx from "clsx";
import Link from "next/link";
import { useGetChatRooms } from "@/apis/chat";
import { useGetMyInfo } from "@/apis/MyPage";
import ProfileWithBadge from "@/components/ui/ProfileWithBadge";
import { IconSearchBlue, IconSolidConnentionLogo } from "@/public/svgs/mentor";
import { UserRole } from "@/types/mentor";
import { convertISODateToKoreanTime } from "@/utils/datetimeUtils";
import useIsDesktopViewport from "@/utils/useIsDesktopViewport";

type ChatRoom = NonNullable<ReturnType<typeof useGetChatRooms>["data"]>[number];

const ChatPageClient = () => {
  const { data: chatRooms = [], isPending: isChatRoomsPending } = useGetChatRooms();
  const { data: myInfo, isError: isMyInfoError, isLoading: isMyInfoLoading } = useGetMyInfo();
  const isDesktop = useIsDesktopViewport();

  const isMentee = myInfo?.role === UserRole.MENTEE;
  const isPartnerMentor = isMentee;
  const listTitle = isMentee ? "나의 멘토" : "나의 멘티";
  const isProfilePending = isMyInfoLoading || (!isMyInfoError && !myInfo?.role);

  if (isDesktop === null || isProfilePending || isChatRoomsPending) {
    return <div aria-hidden className="min-h-screen bg-white md:bg-k-50" />;
  }

  if (chatRooms.length === 0 && isMentee) {
    return <ChatEmptyState isDesktop={isDesktop} isMentee />;
  }

  if (chatRooms.length === 0) {
    return <ChatEmptyState isDesktop={isDesktop} isMentee={false} />;
  }

  if (isDesktop) {
    return (
      <div className="min-h-screen bg-k-50 px-8 py-8 lg:px-10">
        <header className="mb-8">
          <p className="text-primary typo-sb-9">Mentor</p>
          <h1 className="mt-2 text-k-900 typo-bold-1">멘토 채팅</h1>
          <p className="mt-2 max-w-2xl text-k-500 typo-medium-2">
            진행 중인 멘토링 대화를 확인하고 바로 이어서 대화하세요.
          </p>
        </header>

        <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
          <section className="rounded-lg border border-k-100 bg-white p-6">
            <ChatListHeader title={listTitle} count={chatRooms.length} />
            <ChatRoomList chatRooms={chatRooms} isPartnerMentor={isPartnerMentor} isDesktop />
          </section>

          <aside className="sticky top-8 rounded-lg border border-k-100 bg-white p-6">
            <h2 className="text-k-900 typo-bold-4">빠른 이동</h2>
            <div className="mt-5 grid gap-3">
              {isMentee && <DesktopQuickLink href="/mentor" title="멘토 찾기" description="새로운 멘토를 탐색해요" />}
              <DesktopQuickLink href="/mentor/waiting" title="신청 목록" description="대기 중인 멘토링을 확인해요" />
            </div>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col">
      {isMentee && (
        <Link href="/mentor" className="flex h-[66px] w-full items-center justify-between bg-secondary-100 px-9 py-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-5 w-5">
                <IconSearchBlue />
              </span>
              <span className="text-secondary typo-sb-9">멘토를 찾으러 가볼까요?</span>
            </div>
            <p className="w-[140px] text-end text-k-600 typo-medium-3">나의 멘토 찾으러가기</p>
          </div>
          <div className="text-blue-600">
            <span>›</span>
          </div>
        </Link>
      )}

      <div className="px-5 py-4">
        <ChatListHeader title={listTitle} count={chatRooms.length} />
        <ChatRoomList chatRooms={chatRooms} isPartnerMentor={isPartnerMentor} />
      </div>
    </div>
  );
};

const ChatEmptyState = ({ isDesktop, isMentee }: { isDesktop: boolean; isMentee: boolean }) => {
  const content = (
    <div className={clsx("flex flex-col items-center justify-center", isDesktop ? "min-h-[360px]" : "min-h-screen")}>
      <div className="w-15 h-[45px]">
        <IconSolidConnentionLogo />
      </div>
      <p className="text-center text-k-300 typo-medium-2">
        {isMentee ? (
          <>
            현재 매칭된 멘토가 없어요.
            <br />
            멘토부터 찾아볼까요?
          </>
        ) : (
          "현재 진행 중인 채팅이 없어요."
        )}
      </p>
      {isMentee && (
        <Link
          href="/mentor"
          className="mt-5 flex h-[52px] w-60 items-center justify-center gap-[10px] rounded-[30px] bg-gradient-to-l from-primary to-sub-a px-[10px] text-white typo-sb-9"
        >
          멘토 찾으러 가볼까요?
        </Link>
      )}
    </div>
  );

  if (!isDesktop) {
    return content;
  }

  return (
    <div className="min-h-screen bg-k-50 px-8 py-8 lg:px-10">
      <header className="mb-8">
        <p className="text-primary typo-sb-9">Mentor</p>
        <h1 className="mt-2 text-k-900 typo-bold-1">멘토 채팅</h1>
      </header>
      <section className="rounded-lg border border-k-100 bg-white p-6">{content}</section>
    </div>
  );
};

const ChatListHeader = ({ title, count }: { title: string; count: number }) => (
  <div className="mb-4 flex items-center gap-[10px]">
    <h2 className="text-gray-900 typo-sb-5">{title}</h2>
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-center text-white typo-regular-4">
      {count}
    </span>
  </div>
);

const ChatRoomList = ({
  chatRooms,
  isPartnerMentor,
  isDesktop = false,
}: {
  chatRooms: ChatRoom[];
  isPartnerMentor: boolean;
  isDesktop?: boolean;
}) => (
  <div className={isDesktop ? "grid gap-2" : "w-full space-y-3"}>
    {chatRooms.map((chat) => {
      const { nickname, profileUrl } = chat.partner;
      const { lastChatMessage, lastReceivedTime, unReadCount } = chat;

      return (
        <Link
          key={chat.id}
          href={`/mentor/chat/${chat.id}`}
          className={clsx(
            "flex items-center justify-between border-k-50",
            isDesktop ? "rounded-lg border px-4 py-3 transition-colors hover:bg-k-50" : "border-b py-2",
          )}
        >
          <div className="flex min-w-0 items-center gap-3">
            <ProfileWithBadge profileImageUrl={profileUrl} isMentor={isPartnerMentor} width={48} height={48} />
            <div className="flex min-w-0 flex-col items-start">
              <h3 className="text-k-900 typo-sb-9">{nickname}</h3>
              <p className="max-w-full truncate text-k-600 typo-regular-2">{lastChatMessage}</p>
            </div>
          </div>
          <div className="ml-4 flex shrink-0 flex-col items-end gap-1">
            <p className="text-k-500 typo-regular-4">{convertISODateToKoreanTime(lastReceivedTime)}</p>
            {unReadCount > 0 && (
              <span className="ml-2 rounded-full bg-secondary px-2 py-1 text-white typo-regular-4">
                {unReadCount > 9 ? "9+" : unReadCount}
              </span>
            )}
          </div>
        </Link>
      );
    })}
  </div>
);

const DesktopQuickLink = ({ href, title, description }: { href: string; title: string; description: string }) => (
  <Link href={href} className="rounded-lg bg-k-50 px-4 py-3 transition-colors hover:bg-k-100">
    <span className="block text-k-800 typo-sb-7">{title}</span>
    <span className="mt-1 block text-k-500 typo-regular-2">{description}</span>
  </Link>
);

export default ChatPageClient;
