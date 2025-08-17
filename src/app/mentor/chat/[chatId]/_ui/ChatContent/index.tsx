"use client";

import Link from "next/link";
import React from "react";

import clsx from "clsx";

import ProfileWithBadge from "@/components/ui/ProfileWithBadge";

import useChatListHandler from "./_hooks/useChatListHandler";
import useJwtRouteHandler from "./_hooks/useJwtRouteHandler";
import usePutChatReadHandler from "./_hooks/usePutChatReadHandler";
import { formatDateSeparator, isSameDay } from "./_lib/dateUtils";
import ChatInputBar from "./_ui/ChatInputBar";
import ChatMessageBox from "./_ui/ChatMessageBox";

import { ConnectionStatus } from "@/types/chat";

import useGetPartnerInfo from "@/api/chat/clients/useGetPartnerInfo";

interface ChatContentProps {
  chatId: number;
}

const ChatContent = ({ chatId }: ChatContentProps) => {
  const { isMentor, currentUserId } = useJwtRouteHandler();
  // 채팅 읽음 상태 업데이트 훅 진입시 자동으로
  usePutChatReadHandler(chatId);

  // 채팅 리스트 관리 훅
  const {
    submittedMessages,
    connectionStatus,
    firstRef,
    isLoading,
    isFetchingNextPage,
    sendTextMessage,
    addImageMessage,
    addFileMessage,
    messagesEndRef,
    chatContainerRef,
  } = useChatListHandler(chatId);

  const { data: partnerInfo } = useGetPartnerInfo(chatId);

  const { partnerId, nickname, profileUrl, university } = partnerInfo ?? {};

  return (
    <div className="relative flex h-[calc(100vh-112px)] flex-col">
      {/* 채팅 메시지 영역 - 스크롤 가능한 영
      {/* 연결 상태 표시 */}

      <div className="flex-1 overflow-hidden">
        <div className="flex h-full flex-col px-5 pb-2">
          {/* 하단 여백 추가 */}
          {/* Floating 멘토 정보 영역 */}
          <div className="z-10 mt-5 h-16 w-full flex-shrink-0">
            <div
              className={clsx(
                "flex w-full items-center justify-between rounded px-2.5 py-2",
                isMentor ? "bg-sub-c-100 text-sub-c-500" : "bg-primary-100 text-primary",
              )}
            >
              <div className="flex items-center gap-2">
                <ProfileWithBadge profileImageUrl={profileUrl} width={30} height={30} />
                <div className="flex h-full items-center">
                  <span className="text-base font-semibold text-k-700">{nickname}</span>
                  <div className="mx-4 h-10 w-[1px] bg-k-100"></div>
                  <div className="flex text-sm font-medium">{university ? university : "예비솔커"}</div>
                </div>
              </div>
              <Link
                className={clsx(
                  "rounded-3xl px-4 py-2 text-sm font-semibold text-k-0",
                  isMentor ? "bg-sub-c-500" : "bg-primary",
                )}
                href={`/mentor/${partnerId}`}
              >
                멘토 페이지
              </Link>
            </div>
            <div className="rounded bg-white px-4 py-2 text-center">
              {connectionStatus === ConnectionStatus.Connected ? (
                <p
                  className={clsx(
                    "bg-gradient-to-r bg-clip-text text-sm font-semibold text-transparent",
                    isMentor ? "from-sub-c-500 to-primary-600" : "from-primary to-sub-a",
                  )}
                >
                  멘토링이 연결되었습니다! 채팅을 시작해보세요!
                </p>
              ) : (
                <p className="text-sm font-semibold text-gray-500">연결이 끊어졌습니다. 잠시 후 다시 시도해주세요.</p>
              )}
            </div>
          </div>
          {/* 채팅 메시지 영역 - 항상 스크롤 가능, 스크롤바 숨김 */}
          <div
            ref={chatContainerRef}
            className="scrollbar-hide flex-1 overflow-y-auto p-4 pb-6"
            style={{
              scrollbarWidth: "none" /* Firefox */,
              msOverflowStyle: "none" /* Internet Explorer 10+ */,
            }}
          >
            {/* 초기 로딩 표시 - 상단 고정 */}
            {isLoading && (
              <div className="flex justify-center py-4">
                <span className="text-k-500">채팅 기록을 불러오는 중...</span>
              </div>
            )}

            <div className="space-y-4">
              {/* 상단 무한 스크롤 로딩 표시 */}
              {isFetchingNextPage && (
                <div className="flex justify-center py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    <span className="text-sm text-k-500">이전 메시지를 불러오는 중...</span>
                  </div>
                </div>
              )}

              {/* 첫 번째 메시지에 ref 부착하여 위로 스크롤 시 더 오래된 메시지 로드 */}
              {submittedMessages.map((message, index) => {
                const showDateSeparator =
                  index === 0 || !isSameDay(submittedMessages[index - 1].createdAt, message.createdAt);

                return (
                  <div
                    key={message.id}
                    ref={index === 0 ? firstRef : null} // 첫 번째 메시지에 ref 부착
                  >
                    {/* 날짜 구분선 */}
                    {showDateSeparator && (
                      <div className="my-4 mb-6 flex w-full justify-center">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                          {formatDateSeparator(message.createdAt)}
                        </span>
                      </div>
                    )}
                    {/* 일반 채팅 메시지 */}
                    <ChatMessageBox key={message.id} message={message} currentUserId={currentUserId} />
                  </div>
                );
              })}

              {/* 스크롤 타겟 - 메시지 목록 끝 */}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      </div>

      {/* 메시지 입력 영역 - 항상 하단 고정 */}
      <ChatInputBar
        onSendMessage={(data) => {
          sendTextMessage(data.message, currentUserId);
        }}
        onSendImages={(data) => {
          addImageMessage(data.images, currentUserId);
        }}
        onSendFiles={(data) => {
          addFileMessage(data.files, currentUserId);
        }}
      />
    </div>
  );
};

export default ChatContent;
