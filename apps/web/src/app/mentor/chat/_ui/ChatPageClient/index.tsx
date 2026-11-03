"use client";

import Link from "next/link";
import { type ChatRoom, useGetChatRooms } from "@/apis/chat";
import ProfileWithBadge from "@/components/ui/ProfileWithBadge";
import useAuthStore from "@/lib/zustand/useAuthStore";
import { IconSearchBlue, IconSolidConnentionLogo } from "@/public/svgs/mentor";
import { UserRole } from "@/types/mentor";
import { convertISODateToKoreanTime } from "@/utils/datetimeUtils";
import ChatAccess from "../ChatAccess";

const getReceivedTimestamp = (value: string) => {
  if (typeof value !== "string" || !value.trim()) return null;
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : null;
};

const compareRecentRooms = (first: ChatRoom, second: ChatRoom) => {
  const firstTime = getReceivedTimestamp(first.lastReceivedTime);
  const secondTime = getReceivedTimestamp(second.lastReceivedTime);
  if (firstTime === null) return secondTime === null ? 0 : 1;
  if (secondTime === null) return -1;
  return secondTime - firstTime;
};

const EmptyChatRooms = ({ isMentee }: { isMentee: boolean }) => (
  <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-5 text-center">
    <div aria-hidden="true" className="h-[45px] w-15">
      <IconSolidConnentionLogo />
    </div>
    <p className="text-k-500 typo-medium-2">
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
      <Link href="/mentor" className="rounded-3xl bg-primary px-6 py-3 text-white typo-sb-9">
        멘토 찾으러 가볼까요?
      </Link>
    )}
  </div>
);

const ChatRoomList = ({ userId }: { userId: number }) => {
  const { data: chatRooms, isPending, isError, isFetching, refetch } = useGetChatRooms(userId);
  const role = useAuthStore((state) => state.clientRole ?? state.serverRole);
  const isMentee = role === UserRole.MENTEE;

  if (!chatRooms) {
    return isError ? (
      <div role="alert" className="flex min-h-[40vh] flex-col items-center justify-center gap-3 px-5 text-center">
        <p className="text-k-700 typo-medium-2">채팅 목록을 불러오지 못했어요.</p>
        <button
          type="button"
          disabled={isFetching}
          onClick={() => void refetch()}
          className="rounded-lg bg-primary px-5 py-2 text-white disabled:opacity-50"
        >
          다시 시도
        </button>
      </div>
    ) : (
      <p role="status" className="px-5 py-16 text-center text-k-500">
        {isPending ? "채팅 목록을 불러오고 있어요." : "채팅 목록을 확인하고 있어요."}
      </p>
    );
  }

  const sortedRooms = [...chatRooms].sort(compareRecentRooms);

  return (
    <div className="flex h-full min-w-0 w-full flex-col">
      {isError && (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-2 bg-k-50 px-5 py-3">
          <p className="text-k-700 typo-regular-4">새 채팅 목록을 불러오지 못했어요. 이전 목록을 표시하고 있어요.</p>
          <button
            type="button"
            disabled={isFetching}
            onClick={() => void refetch()}
            className="rounded border border-k-200 px-3 py-1 text-k-700 typo-regular-4 disabled:opacity-50"
          >
            다시 시도
          </button>
        </div>
      )}
      {isFetching && (
        <p role="status" className="px-5 py-2 text-k-500 typo-regular-4">
          채팅 목록을 업데이트하고 있어요.
        </p>
      )}
      {sortedRooms.length === 0 ? (
        <EmptyChatRooms isMentee={isMentee} />
      ) : (
        <>
          {isMentee && (
            <Link
              href="/mentor"
              className="flex min-h-[66px] w-full items-center justify-between gap-3 bg-secondary-100 px-5 py-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span aria-hidden="true" className="h-5 w-5 shrink-0">
                    <IconSearchBlue />
                  </span>
                  <span className="text-secondary typo-sb-9">멘토를 찾으러 가볼까요?</span>
                </div>
                <p className="text-k-600 typo-medium-3">나의 멘토 찾으러가기</p>
              </div>
              <span aria-hidden="true" className="shrink-0 text-blue-600">
                ›
              </span>
            </Link>
          )}
          <section aria-label="채팅 목록" className="min-w-0 px-5 py-4">
            <div className="mb-4 flex items-center gap-2.5">
              <h2 className="text-gray-900 typo-sb-5">{isMentee ? "나의 멘토" : "나의 멘티"}</h2>
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-white typo-regular-4">
                <span aria-hidden="true">{sortedRooms.length}</span>
                <span className="sr-only">채팅방 {sortedRooms.length}개</span>
              </span>
            </div>
            <ul aria-label="채팅방" className="w-full space-y-3">
              {sortedRooms.map((chat) => {
                const { nickname, profileUrl } = chat.partner;
                const receivedTime =
                  getReceivedTimestamp(chat.lastReceivedTime) === null
                    ? null
                    : convertISODateToKoreanTime(chat.lastReceivedTime);

                return (
                  <li key={chat.id} className="min-w-0">
                    <Link
                      href={`/mentor/chat/${chat.id}`}
                      className="flex min-w-0 items-center justify-between gap-3 border-b border-k-50 py-2"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-2">
                        <div className="shrink-0">
                          <ProfileWithBadge profileImageUrl={profileUrl} isMentor={isMentee} width={48} height={48} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-k-900 typo-sb-9">{nickname}</h3>
                          <p className="truncate text-k-600 typo-regular-2">
                            {chat.lastChatMessage || "새로운 멘토링이 시작되었어요!"}
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        {receivedTime && (
                          <time
                            dateTime={chat.lastReceivedTime}
                            className="whitespace-nowrap text-k-500 typo-regular-4"
                          >
                            {receivedTime}
                          </time>
                        )}
                        {chat.unReadCount > 0 && (
                          <span className="rounded-full bg-secondary px-2 py-1 text-white typo-regular-4">
                            <span aria-hidden="true">{chat.unReadCount > 9 ? "9+" : chat.unReadCount}</span>
                            <span className="sr-only">안 읽은 메시지 {chat.unReadCount}개</span>
                          </span>
                        )}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        </>
      )}
    </div>
  );
};

const ChatPageClient = () => <ChatAccess>{(userId) => <ChatRoomList key={userId} userId={userId} />}</ChatAccess>;

export default ChatPageClient;
