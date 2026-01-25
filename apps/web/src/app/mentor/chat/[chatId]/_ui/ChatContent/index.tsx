"use client";

import clsx from "clsx";
import Link from "next/link";
import { useGetPartnerInfo } from "@/apis/chat";

import ProfileWithBadge from "@/components/ui/ProfileWithBadge";
import useAuthStore from "@/lib/zustand/useAuthStore";
import { ConnectionStatus } from "@/types/chat";
import { UserRole } from "@/types/mentor";
import { tokenParse } from "@/utils/jwtUtils";
import useChatListHandler from "./_hooks/useChatListHandler";
import usePutChatReadHandler from "./_hooks/usePutChatReadHandler";
import { formatDateSeparator, isSameDay } from "./_lib/dateUtils";
import ChatInputBar from "./_ui/ChatInputBar";
import ChatMessageBox from "./_ui/ChatMessageBox";

interface ChatContentProps {
  chatId: number;
}

const ChatContent = ({ chatId }: ChatContentProps) => {
  const { accessToken } = useAuthStore();
  const parsedData = tokenParse(accessToken);
  const userId = parsedData?.sub ?? 0;

  const isMentor = parsedData?.role === UserRole.MENTOR || parsedData?.role === UserRole.ADMIN;

  // 채팅 읽음 상태 업데이트 훅 진입시 자동으로
  usePutChatReadHandler(chatId);

  // 채팅 리스트 관리 훅
  const {
    // Data & State
    messages,
    connectionStatus,
    isLoading, // 초기 데이터 로딩 상태
    isFetchingNextPage, // 이전 기록 로딩 상태

    // Refs
    messagesEndRef, // 자동 스크롤을 위한 ref
    topDetectorRef, // 무한 스크롤 감지를 위한 ref

    // Handlers
    sendTextMessage,
    addImageMessagePreview,
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
                  <span className="text-k-700 typo-sb-7">{nickname}</span>
                  <div className="mx-4 h-10 w-[1px] bg-k-100"></div>
                  <div className="flex typo-medium-2">{university ? university : "예비솔커"}</div>
                </div>
              </div>
              <Link
                className={clsx("rounded-3xl px-4 py-2 text-k-0 typo-sb-9", isMentor ? "bg-sub-c-500" : "bg-primary")}
                // TODO 멘티 페이지 라우터 변경 시 수정 필요
                // partnerId 가 mentorId가 맞는지 확인 필요
                href={isMentor ? `/${partnerId}` : `/mentor/${partnerId}`}
              >
                {isMentor ? "멘티 페이지" : "멘토 페이지"}
              </Link>
            </div>
            <div className="rounded bg-white px-4 py-2 text-center">
              <div className="rounded bg-white px-4 py-2 text-center">
                {connectionStatus === ConnectionStatus.Connected ? (
                  <p
                    className={clsx(
                      "bg-gradient-to-r bg-clip-text text-transparent typo-sb-9",
                      isMentor ? "from-sub-c-500 to-primary-600" : "from-primary to-sub-a",
                    )}
                  >
                    멘토링이 연결되었습니다! 채팅을 시작해보세요!
                  </p>
                ) : connectionStatus === ConnectionStatus.Pending ? (
                  <p className="text-yellow-500 typo-sb-9">연결 대기 중입니다. 잠시만 기다려주세요.</p>
                ) : connectionStatus === ConnectionStatus.Error ? (
                  <p className="text-red-500 typo-sb-9">연결 중 오류가 발생했습니다. 다시 시도해주세요.</p>
                ) : connectionStatus === ConnectionStatus.Disconnected ? (
                  <p className="text-gray-500 typo-sb-9">연결이 끊어졌습니다. 잠시 후 다시 시도해주세요.</p>
                ) : null}
              </div>
            </div>
          </div>
          {/* 채팅 메시지 영역 - 항상 스크롤 가능, 스크롤바 숨김 */}
          <div
            className="scrollbar-hide mt-4 flex-1 overflow-y-auto p-4 pb-6"
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
                    <span className="text-k-500 typo-regular-2">이전 메시지를 불러오는 중...</span>
                  </div>
                </div>
              )}

              {/* 첫 번째 메시지에 ref 부착하여 위로 스크롤 시 더 오래된 메시지 로드 */}
              {messages.map((message, index) => {
                const showDateSeparator = index === 0 || !isSameDay(messages[index - 1].createdAt, message.createdAt);

                return (
                  <div
                    key={message.id}
                    ref={index === 0 ? topDetectorRef : null} // 첫 번째 메시지에 ref 부착
                  >
                    {/* 날짜 구분선 */}
                    {showDateSeparator && (
                      <div className="my-4 mb-6 flex w-full justify-center">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-600 typo-regular-2">
                          {formatDateSeparator(message.createdAt)}
                        </span>
                      </div>
                    )}
                    {/* 일반 채팅 메시지 */}
                    <ChatMessageBox
                      key={message.id}
                      message={message}
                      currentUserId={userId}
                      partnerNickname={nickname}
                    />
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
          sendTextMessage(data.message, userId);
        }}
        onSendImages={(data) => {
          addImageMessagePreview(data.images, userId);
        }}
        onSendFiles={(data) => {
          addImageMessagePreview(data.files, userId);
        }}
      />
    </div>
  );
};

export default ChatContent;
