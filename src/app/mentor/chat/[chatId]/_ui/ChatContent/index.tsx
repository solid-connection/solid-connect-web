"use client";

import React, { useEffect, useRef, useState } from "react";

import ProfileWithBadge from "@/components/ui/ProfileWithBadge";

import useChatListHandler from "./_hooks/useChatListHandler";
import usePutChatReadHandler from "./_hooks/usePutChatReadHandler";
import { formatDateSeparator, isSameDay } from "./_lib/dateUtils";
import ChatInputBar from "./_ui/ChatInputBar";
import ChatMessageBox from "./_ui/ChatMessageBox";

import { ChatPartner } from "@/types/chat";

// 더미 파트너 정보
const dummyPartner: ChatPartner = {
  partnerId: 2,
  nickname: "김솔커 멘토",
  profileUrl: null,
};

interface ChatContentProps {
  chatId: number;
  currentUserId?: number; // 현재 사용자 ID
}

const ChatContent = ({ chatId, currentUserId = 1 }: ChatContentProps) => {
  // 첨부파일 옵션 상태

  // 채팅 읽음 상태 업데이트 훅 진입시 자동으로
  usePutChatReadHandler(chatId);

  // 채팅 리스트 관리 훅
  const {
    submittedMessages,
    firstRef,
    isLoading,
    isFetchingNextPage,
    addTextMessage,
    addImageMessage,
    addFileMessage,
    messagesEndRef,
    chatContainerRef,
  } = useChatListHandler(chatId);

  return (
    <div className="relative flex h-[calc(100vh-112px)] flex-col">
      {/* 채팅 메시지 영역 - 스크롤 가능한 영역 */}
      <div className="flex-1 overflow-hidden">
        <div className="flex h-full flex-col px-5 pb-2">
          {" "}
          {/* 하단 여백 추가 */}
          {/* Floating 멘토 정보 영역 */}
          <div className="z-10 mt-5 h-16 w-full flex-shrink-0">
            <div className="flex w-full items-center justify-between rounded bg-primary-100 px-2.5 py-2">
              <div className="flex items-center gap-2">
                <ProfileWithBadge width={24} height={24} />
                <div className="flex h-full items-center">
                  <span className="text-base font-semibold text-k-700">{dummyPartner.nickname}</span>
                  <div className="mx-4 h-10 w-[1px] bg-k-100"></div>
                  <div className="flex text-sm font-medium text-primary">
                    스웨덴 <br /> 대학교 컴퓨터공학과
                  </div>
                </div>
              </div>
              <button className="rounded-3xl bg-primary px-4 py-2 text-sm font-semibold text-k-0">멘토 페이지</button>
            </div>
            <div className="rounded bg-white px-4 py-2">
              <p className="bg-gradient-to-r from-primary to-sub-a bg-clip-text text-center text-sm font-semibold text-transparent">
                멘토링이 연결되었습니다! 채팅을 시작해보세요!
              </p>
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
          addTextMessage(data.message, currentUserId || 1);
        }}
        onSendImages={(data) => {
          addImageMessage(data.images, currentUserId || 1);
        }}
        onSendFiles={(data) => {
          addFileMessage(data.files, currentUserId || 1);
        }}
      />
    </div>
  );
};

export default ChatContent;
