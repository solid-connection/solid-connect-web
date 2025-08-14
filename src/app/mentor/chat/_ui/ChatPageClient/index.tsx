"use client";

import Link from "next/link";

import { convertISODateToKoreanTime } from "@/utils/datetimeUtils";

import ProfileWithBadge from "@/components/ui/ProfileWithBadge";

import useGetChatRooms from "@/api/chat/clients/useGetChatRooms";
import { IconSearchBlue, IconSolidConnentionLogo } from "@/public/svgs/mentor";

const ChatPageClient = () => {
  const { data: chatRooms = [] } = useGetChatRooms(); // 가상의 함수로 채팅 데이터를 가져온다고 가정

  // 연결된 멘토가 없을 때의 처리
  if (chatRooms.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="w-15 h-[45px]">
          <IconSolidConnentionLogo />
        </div>
        <p className="text-center font-medium text-k-300">
          현재 매칭된 멘토가 없어요.
          <br />
          멘토부터 찾아볼까요?
        </p>
        <Link
          href={"/mentor"}
          className="mt-5 flex h-[52px] w-60 items-center justify-center gap-[10px] rounded-[30px] bg-[linear-gradient(270deg,_var(--Primary-Color,_#5950F6)_0%,_var(--SubA-Color,_#388CE8)_100%)] px-[10px] font-semibold text-white"
        >
          멘토 찾으러 가볼까요?
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col">
      {/* 헤더 */}
      <div className="flex h-[66px] w-full items-center justify-between bg-secondary-100 px-9 py-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-5 w-5">
              <IconSearchBlue />
            </span>
            <span className="font-semibold text-secondary">멘토를 찾으러 가볼까요?</span>
          </div>
          <p className="w-[140px] text-end text-[13px] font-medium text-k-600">나의 멘토 찾으러가기</p>
        </div>
        <div className="text-blue-600">
          <span>›</span>
        </div>
      </div>

      {/* 나의 멘토 섹션 */}
      <div className="px-5 py-4">
        <div className="mb-4 flex items-center gap-[10px]">
          <h2 className="text-lg font-semibold text-gray-900">나의 멘토</h2>
          <span className="rounded-full bg-primary px-2 py-1 text-xs text-white">{chatRooms.length}</span>
        </div>

        {/* 채팅 리스트 */}
        <button className="w-full space-y-3">
          {chatRooms.map((chat) => {
            const { nickname, profileUrl } = chat.partner;
            const { lastChatMessage, lastReceivedTime, unReadCount } = chat;

            return (
              <div key={chat.id} className="flex items-center justify-between border-b border-k-50 py-2">
                <div className="flex items-center gap-2">
                  <ProfileWithBadge profileImageUrl={profileUrl} width={48} height={48} />
                  <div className="flex flex-col items-start">
                    <h3 className="font-semibold text-k-900">{nickname}</h3>
                    <p className="truncate text-sm text-k-600">{lastChatMessage}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <p className="text-xs text-k-500">{convertISODateToKoreanTime(lastReceivedTime)}</p>
                  {unReadCount > 0 && (
                    <span className="ml-2 rounded-full bg-secondary px-2 py-1 text-xs text-white">
                      {unReadCount > 9 ? "9+" : unReadCount}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </button>
      </div>
    </div>
  );
};

export default ChatPageClient;
