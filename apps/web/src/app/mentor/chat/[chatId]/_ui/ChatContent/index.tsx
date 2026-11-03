"use client";

import { useGetPartnerInfo } from "@/apis/chat";
import ChatAccess from "@/app/mentor/chat/_ui/ChatAccess";
import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import { getMessageKey } from "@/lib/chat/messages";
import type { ChatConnection, OutgoingMessage } from "@/lib/chat/types";
import { useChatScroll } from "@/lib/chat/useChatScroll";
import { useChatSession } from "@/lib/chat/useChatSession";
import useAuthStore from "@/lib/zustand/useAuthStore";
import type { ChatMessage } from "@/types/chat";
import { UserRole } from "@/types/mentor";
import ChatNavBar from "../ChatNavBar";
import { formatDateSeparator, isSameDay } from "./_lib/dateUtils";
import ChatInputBar from "./_ui/ChatInputBar";
import ChatMessageBox from "./_ui/ChatMessageBox";

const CONNECTION_LABEL: Record<ChatConnection, string> = {
  connecting: "채팅에 연결하고 있어요.",
  connected: "실시간으로 연결되어 있어요.",
  reconnecting: "연결을 복구하고 있어요. 입력한 내용은 유지됩니다.",
  offline: "인터넷 연결을 확인해주세요. 입력한 내용은 유지됩니다.",
  error: "채팅에 연결하지 못했어요. 다시 연결해주세요.",
  disconnected: "채팅 연결이 종료되었어요.",
};

const toPreviewMessage = (outgoing: OutgoingMessage): ChatMessage => ({
  id: -1,
  content: outgoing.content,
  senderId: outgoing.senderId,
  createdAt: outgoing.createdAt,
  attachments: outgoing.remainingImageUrls.map((url, index) => ({
    id: index,
    isImage: true,
    url,
    thumbnailUrl: null,
    createdAt: outgoing.createdAt,
  })),
});

const RoomContent = ({ chatId, userId }: { chatId: number; userId: number }) => {
  const role = useAuthStore((state) => state.clientRole ?? state.serverRole);
  const partner = useGetPartnerInfo(chatId, userId);
  const partnerStatus = (partner.error as { response?: { status?: number } } | null)?.response?.status;
  const partnerAccessDenied = partnerStatus === 403 || partnerStatus === 404;
  const { session, snapshot, sendText, sendImages } = useChatSession(chatId, userId, !partner.isError);
  const scroll = useChatScroll({
    messages: snapshot.messages,
    outgoingCount: snapshot.outgoing.length,
    isLoadingOlder: snapshot.isLoadingOlder,
    setReading: session.setReading,
  });
  const accessDenied = snapshot.accessDenied || partnerAccessDenied;
  const canSend =
    snapshot.connection === "connected" && snapshot.historyStatus === "ready" && partner.isSuccess && !accessDenied;

  return (
    <div className="relative flex h-[calc(100dvh-112px)] min-h-0 flex-col">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-k-50 px-5 py-3">
        <p role="status" className="text-k-600 typo-regular-4">
          {CONNECTION_LABEL[snapshot.connection]}
        </p>
        {snapshot.connection !== "connected" && !accessDenied && (
          <button
            type="button"
            className="shrink-0 rounded-lg border border-k-100 px-3 py-2 text-primary typo-sb-11"
            onClick={session.reconnect}
          >
            다시 연결
          </button>
        )}
      </div>

      {partner.isError && (
        <div
          role="alert"
          className="flex items-center justify-between gap-3 bg-k-50 px-5 py-3 text-k-700 typo-regular-3"
        >
          <p>{partnerAccessDenied ? "이 채팅방에 접근할 수 없습니다." : "상대 정보를 불러오지 못했어요."}</p>
          <button type="button" onClick={() => void partner.refetch()} className="shrink-0 text-primary">
            다시 시도
          </button>
        </div>
      )}
      {snapshot.syncError && (
        <div role="alert" className="px-5 py-2 text-k-600 typo-regular-4">
          {snapshot.syncError}{" "}
          <button type="button" onClick={() => void session.syncLatest()} className="text-primary">
            기록 다시 확인
          </button>
        </div>
      )}
      {snapshot.readError && (
        <p role="status" className="px-5 py-2 text-k-600 typo-regular-4">
          읽음 상태를 반영하지 못했어요.{" "}
          <button type="button" onClick={session.retryRead} className="text-primary">
            다시 시도
          </button>
        </p>
      )}

      <div
        ref={scroll.containerRef}
        role="region"
        onScroll={scroll.onScroll}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4"
        style={{ overflowAnchor: "none" }}
        aria-label="채팅 메시지"
      >
        <div ref={scroll.contentRef} className="space-y-4">
          {snapshot.hasMore && !accessDenied && (
            <div className="text-center">
              <button
                type="button"
                disabled={snapshot.isLoadingOlder}
                onClick={() => {
                  scroll.captureAnchor();
                  void session.loadOlder();
                }}
                className="rounded-full border border-k-100 px-4 py-2 text-k-600 typo-regular-4 disabled:opacity-50"
              >
                {snapshot.isLoadingOlder ? "이전 메시지를 불러오는 중…" : "이전 메시지 더 보기"}
              </button>
              {snapshot.olderError && (
                <p role="alert" className="mt-2 text-accent-custom-red typo-regular-4">
                  {snapshot.olderError}
                </p>
              )}
            </div>
          )}
          {snapshot.historyStatus === "loading" && (
            <p role="status" className="py-10 text-center text-k-500">
              채팅 기록을 불러오고 있어요.
            </p>
          )}
          {snapshot.historyStatus === "error" && (
            <div role="alert" className="space-y-3 py-10 text-center text-k-600">
              <p>{snapshot.historyError}</p>
              {!accessDenied && (
                <button type="button" onClick={() => void session.syncLatest()} className="text-primary">
                  다시 시도
                </button>
              )}
            </div>
          )}
          {snapshot.historyStatus === "ready" && snapshot.messages.length === 0 && snapshot.outgoing.length === 0 && (
            <p className="py-10 text-center text-k-500 typo-regular-3">아직 대화가 없어요. 첫 메시지를 보내보세요.</p>
          )}
          {!accessDenied &&
            snapshot.messages.map((message, index) => (
              <div key={getMessageKey(message)} data-message-key={getMessageKey(message)}>
                {(index === 0 || !isSameDay(snapshot.messages[index - 1].createdAt, message.createdAt)) && (
                  <div className="mb-4 flex justify-center">
                    <span className="rounded-full bg-k-50 px-3 py-1 text-k-600 typo-regular-2">
                      {formatDateSeparator(message.createdAt)}
                    </span>
                  </div>
                )}
                <ChatMessageBox
                  message={message}
                  currentUserId={userId}
                  partnerNickname={partner.data?.nickname}
                  partnerProfileUrl={partner.data?.profileUrl}
                  isPartnerMentor={role === UserRole.MENTEE}
                />
              </div>
            ))}
          {!accessDenied &&
            snapshot.outgoing.map((outgoing) => (
              <div key={outgoing.clientId} className="space-y-1">
                <ChatMessageBox message={toPreviewMessage(outgoing)} currentUserId={userId} />
                <div className="text-right text-k-500 typo-regular-4">
                  {outgoing.status === "pending" ? (
                    <span role="status">전송 확인 중…</span>
                  ) : (
                    <div className="ml-auto max-w-xs space-y-2 rounded-lg border border-k-100 p-3 text-left">
                      <p>
                        전송 여부를 확인하지 못했어요. 기록에서 메시지를 확인해주세요. 자동으로 다시 보내지 않습니다.
                      </p>
                      <div className="flex gap-4">
                        <button type="button" onClick={() => void session.syncLatest()} className="text-primary">
                          기록 확인
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm("이 대기 항목을 지울까요? 이미 전달된 메시지는 삭제되지 않습니다."))
                              session.dismissOutgoing(outgoing.clientId);
                          }}
                          className="text-k-600"
                        >
                          대기 항목 지우기
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {scroll.hasNewMessages && (
        <button
          type="button"
          onClick={scroll.scrollToBottom}
          className="absolute bottom-36 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-2 text-white shadow-sdwB typo-regular-4"
        >
          새 메시지 보기
        </button>
      )}
      <ChatInputBar
        disabled={accessDenied || !partner.isSuccess || snapshot.historyStatus !== "ready"}
        canSend={canSend}
        onSendText={sendText}
        onSendImages={sendImages}
      />
    </div>
  );
};

const ChatContent = ({ chatId }: { chatId: number }) => (
  <ChatAccess fallbackHeader={<TopDetailNavigation title="멘토 채팅" backHref="/mentor/chat" />}>
    {(userId) => (
      <>
        <ChatNavBar chatId={chatId} userId={userId} />
        <RoomContent key={`${userId}:${chatId}`} chatId={chatId} userId={userId} />
      </>
    )}
  </ChatAccess>
);

export default ChatContent;
