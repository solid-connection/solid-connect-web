"use client";

import Link from "next/link";
import { useGetChatRooms } from "@/apis/chat";
import { type MyInfoResponse, useGetMyInfo } from "@/apis/MyPage";
import MentorCard from "@/components/mentor/MentorCard";
import MentorChatCard from "@/components/mentor/MentorChatCard";
import ProfileWithBadge from "@/components/ui/ProfileWithBadge";
import useAuthStore from "@/lib/zustand/useAuthStore";
import type { ChatRoom } from "@/types/chat";
import { UserRole } from "@/types/mentor";
import { convertISODateToKoreanTime } from "@/utils/datetimeUtils";
import useIsDesktopViewport from "@/utils/useIsDesktopViewport";

const MatchContent = () => {
  const { data: myInfo = {} as MyInfoResponse } = useGetMyInfo();
  const { data: chatRoom = [] } = useGetChatRooms();
  const clientRole = useAuthStore((state) => state.clientRole);

  const isMentor = myInfo.role === UserRole.MENTOR || myInfo.role === UserRole.ADMIN;
  const viewAsMentor = clientRole ? clientRole === UserRole.MENTOR : isMentor;
  const isDesktop = useIsDesktopViewport();

  const viewProps = {
    nickname: myInfo.nickname,
    chatRoom,
    viewAsMentor,
  };

  if (isDesktop === null) {
    return <div aria-hidden className="min-h-screen bg-white md:bg-k-50" />;
  }

  return isDesktop ? <MatchDesktopView {...viewProps} /> : <MatchMobileView {...viewProps} />;
};

type MatchViewProps = {
  nickname?: string;
  chatRoom: ChatRoom[];
  viewAsMentor: boolean;
};

const MatchMobileView = ({ nickname, chatRoom, viewAsMentor }: MatchViewProps) => {
  return (
    <div className="flex h-full flex-col px-5">
      <p className="font-pretendard text-k-700 typo-sb-4">
        {nickname ? `${nickname}님의` : "회원님이"}
        <br />
        매칭된 {viewAsMentor ? "멘티" : "멘토"}
      </p>
      {chatRoom.length === 0 ? (
        <MatchEmptyState viewAsMentor={viewAsMentor} />
      ) : (
        <div className="mt-6 flex flex-1 flex-col gap-4 pb-4">
          {chatRoom.map((room) =>
            viewAsMentor ? (
              <MentorChatCard
                key={room.id}
                profileImageUrl={room.partner.profileUrl}
                nickname={room.partner.nickname}
                description={room.lastChatMessage || "안녕하세요! 교환학생에 대해 무엇이든 물어보세요!"}
                time={room.lastReceivedTime}
              />
            ) : (
              <MentorCard key={room.id} mentor={toMentorPreview(room)} />
            ),
          )}
        </div>
      )}
    </div>
  );
};

const MatchDesktopView = ({ nickname, chatRoom, viewAsMentor }: MatchViewProps) => {
  return (
    <div className="desktop-page-shell">
      <header className="mb-8 flex items-end justify-between gap-6">
        <div>
          <p className="text-primary typo-sb-9">My Solid</p>
          <h1 className="mt-2 text-k-900 typo-bold-1">매칭된 {viewAsMentor ? "멘티" : "멘토"}</h1>
          <p className="mt-2 text-k-500 typo-medium-2">
            {nickname ? `${nickname}님의` : "회원님의"} 매칭 현황과 최근 대화를 확인하세요.
          </p>
        </div>
        <div className="rounded-lg border border-k-100 bg-white px-5 py-4 text-right">
          <span className="block text-k-500 typo-medium-5">전체 매칭</span>
          <strong className="mt-1 block text-primary typo-bold-1">{chatRoom.length}</strong>
        </div>
      </header>

      {chatRoom.length === 0 ? (
        <section className="rounded-lg border border-k-100 bg-white p-6">
          <MatchEmptyState viewAsMentor={viewAsMentor} />
        </section>
      ) : viewAsMentor ? (
        <section className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {chatRoom.map((room) => (
            <DesktopChatRoomCard key={room.id} room={room} />
          ))}
        </section>
      ) : (
        <section className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {chatRoom.map((room) => (
            <MentorCard key={room.id} mentor={toMentorPreview(room)} />
          ))}
        </section>
      )}
    </div>
  );
};

const DesktopChatRoomCard = ({ room }: { room: ChatRoom }) => {
  const lastMessage = room.lastChatMessage || "안녕하세요! 교환학생에 대해 무엇이든 물어보세요!";

  return (
    <Link
      href={`/mentor/chat/${room.id}`}
      className="block rounded-lg border border-k-100 bg-white p-5 transition-transform hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/10"
    >
      <div className="flex items-start gap-4">
        <ProfileWithBadge profileImageUrl={room.partner.profileUrl} width={56} height={56} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-k-900 typo-bold-4">{room.partner.nickname}</h2>
              <p className="mt-1 truncate text-k-500 typo-medium-4">{room.partner.university || "학교 정보 없음"}</p>
            </div>
            {room.lastReceivedTime && (
              <span className="shrink-0 text-k-400 typo-regular-4">
                {convertISODateToKoreanTime(room.lastReceivedTime)}
              </span>
            )}
          </div>
          <p className="mt-4 line-clamp-2 min-h-10 text-k-600 typo-regular-2">{lastMessage}</p>
          {room.unReadCount > 0 && (
            <span className="mt-4 inline-flex rounded-full bg-primary px-2.5 py-1 text-k-0 typo-sb-11">
              새 메시지 {room.unReadCount}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

const MatchEmptyState = ({ viewAsMentor }: { viewAsMentor: boolean }) => (
  <div className="flex min-h-80 flex-col items-center justify-center rounded-lg border border-dashed border-k-100 bg-white py-20 text-center">
    <p className="text-k-500 typo-regular-2">매칭된 {viewAsMentor ? "멘티" : "멘토"}가 없습니다.</p>
  </div>
);

const toMentorPreview = (room: ChatRoom) => ({
  id: room.partner.partnerId,
  profileImageUrl: room.partner.profileUrl ?? null,
  nickname: room.partner.nickname ?? "",
  country: "",
  universityName: room.partner.university ?? "",
  menteeCount: 0,
  hasBadge: false,
  introduction: "",
  channels: [],
  term: "",
});

export default MatchContent;
