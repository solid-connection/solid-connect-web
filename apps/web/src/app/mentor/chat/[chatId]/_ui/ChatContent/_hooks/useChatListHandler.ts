import type { Client } from "@stomp/stompjs";
import { useCallback, useEffect, useRef } from "react";
import { useGetChatHistories } from "@/apis/chat";
import useConnectWebSocket from "@/lib/web-socket/useConnectWebSocket";
import { type ChatMessage, ConnectionStatus } from "@/types/chat";
// --- 프로젝트 내부 의존성 ---
import useInfinityScroll from "@/utils/useInfinityScroll";

const BOTTOM_PROXIMITY_THRESHOLD = 80;

const getMessageDedupeKey = (message: ChatMessage): string => {
  if (message.id > 0) {
    return `id:${message.id}`;
  }

  const attachmentKey = message.attachments
    .map((attachment) => `${attachment.isImage ? "image" : "file"}:${attachment.url}:${attachment.createdAt}`)
    .join(",");

  return `fallback:${message.senderId}:${message.createdAt}:${message.content}:${attachmentKey}`;
};

const useChatListHandler = (chatId: number) => {
  // --- 1. State 및 Ref 선언 ---
  const clientRef = useRef<Client | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null); // 새 메시지 수신 시 자동 스크롤을 위한 ref
  const scrollContainerRef = useRef<HTMLDivElement>(null); // 실제 스크롤 컨테이너 ref
  const hasInitialAutoScrolledRef = useRef(false);
  const prevMessageCountRef = useRef(0);

  // --- 2. 하위 Hooks 호출 ---

  // API를 통해 채팅 기록을 페이지 단위로 가져옵니다.
  const {
    data: chatHistoryPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetChatHistories(chatId);

  // WebSocket 연결을 관리하고 현재 연결 상태를 받아옵니다.
  const { connectionStatus, submittedMessages, setSubmittedMessages } = useConnectWebSocket({
    roomId: chatId,
    clientRef,
  });

  // 화면 상단에 도달했을 때 이전 채팅 기록을 불러오는 무한 스크롤 Hook입니다.
  const { lastElementRef: topDetectorRef } = useInfinityScroll({
    fetchNextPage,
    hasNextPage,
    isDirectionTop: true,
  });

  // --- 3. Effects ---

  // API로부터 받아온 채팅 기록(페이지 배열)을 단일 메시지 배열로 가공하고 정렬합니다.
  useEffect(() => {
    if (chatHistoryPages?.pages) {
      const allMessages = chatHistoryPages.pages.flatMap((page) => page.content || []);
      const sortedMessages = allMessages.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
      // Deduplicate by id, keeping the last occurrence (chronological order)
      const dedupedMessages: ChatMessage[] = [];
      const seenIds = new Set<string>();
      for (let i = sortedMessages.length - 1; i >= 0; i--) {
        const msg = sortedMessages[i];
        const dedupeKey = getMessageDedupeKey(msg);
        if (!seenIds.has(dedupeKey)) {
          seenIds.add(dedupeKey);
          dedupedMessages.unshift(msg);
        }
      }
      setSubmittedMessages(dedupedMessages);
    }
  }, [chatHistoryPages, setSubmittedMessages]);

  // 채팅방 전환 시 자동 스크롤 상태를 초기화합니다.
  useEffect(() => {
    hasInitialAutoScrolledRef.current = false;
    prevMessageCountRef.current = 0;
  }, [chatId]);

  // 초기 히스토리 로딩 완료 후, 최초 1회만 하단으로 이동합니다.
  useEffect(() => {
    if (isLoading || isFetchingNextPage || submittedMessages.length === 0 || hasInitialAutoScrolledRef.current) {
      return;
    }

    const rafId = requestAnimationFrame(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      container.scrollTop = container.scrollHeight;
      hasInitialAutoScrolledRef.current = true;
      prevMessageCountRef.current = submittedMessages.length;
    });

    return () => cancelAnimationFrame(rafId);
  }, [isLoading, isFetchingNextPage, submittedMessages.length]);

  // 신규 메시지 도착 시, 사용자가 하단 근처에 있을 때만 자동으로 하단을 유지합니다.
  useEffect(() => {
    if (isLoading || isFetchingNextPage) return;

    const currentMessageCount = submittedMessages.length;
    const prevMessageCount = prevMessageCountRef.current;
    const container = scrollContainerRef.current;

    if (!container) {
      prevMessageCountRef.current = currentMessageCount;
      return;
    }

    if (currentMessageCount <= prevMessageCount) {
      prevMessageCountRef.current = currentMessageCount;
      return;
    }

    if (!hasInitialAutoScrolledRef.current) {
      prevMessageCountRef.current = currentMessageCount;
      return;
    }

    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;

    if (distanceFromBottom <= BOTTOM_PROXIMITY_THRESHOLD) {
      const rafId = requestAnimationFrame(() => {
        const target = scrollContainerRef.current;
        if (!target) return;
        target.scrollTop = target.scrollHeight;
      });

      prevMessageCountRef.current = currentMessageCount;

      return () => cancelAnimationFrame(rafId);
    }

    prevMessageCountRef.current = currentMessageCount;
  }, [isLoading, isFetchingNextPage, submittedMessages.length]);

  // --- 4. Handler 함수 ---

  /** 텍스트 메시지를 WebSocket을 통해 서버로 전송합니다. */
  const sendTextMessage = useCallback(
    (content: string, senderId: number) => {
      if (content.trim() === "") return; // 빈 메시지 전송 방지

      if (clientRef.current?.active && connectionStatus === ConnectionStatus.Connected) {
        // WebSocket으로 메시지 전송
        clientRef.current.publish({
          destination: `/publish/chat/${chatId}`,
          body: JSON.stringify({ content, senderId }),
        });
      } else {
        // 여기에 메시지 전송 실패에 대한 UI 피드백 로직을 추가할 수 있습니다. (e.g., alert, toast)
      }
    },
    [chatId, connectionStatus],
  ); // chatId와 connectionStatus가 변경될 경우에만 함수를 재생성

  const sendImageMessage = useCallback(
    (imageUrls: string[]) => {
      if (imageUrls.length === 0) return false;

      if (clientRef.current?.active && connectionStatus === ConnectionStatus.Connected) {
        clientRef.current.publish({
          destination: `/publish/chat/${chatId}/image`,
          body: JSON.stringify({ imageUrls }),
        });

        return true;
      }

      return false;
    },
    [chatId, connectionStatus],
  );

  // Track created object URLs for cleanup
  const objectUrlsRef = useRef<string[]>([]);

  /** 이미지 파일만 미리보기 메시지로 추가 */
  const addImageMessagePreview = useCallback(
    (files: File[], senderId: number) => {
      const newMessages: ChatMessage[] = [];
      files.forEach((file) => {
        if (file.type.startsWith("image/")) {
          const tempId = Date.now() + Math.random();
          const imageUrl = URL.createObjectURL(file);
          objectUrlsRef.current.push(imageUrl);
          newMessages.push({
            id: tempId,
            content: `이미지: ${file.name}`,
            senderId,
            createdAt: new Date().toISOString(),
            attachments: [
              {
                id: tempId,
                isImage: true,
                url: imageUrl,
                thumbnailUrl: imageUrl,
                createdAt: new Date().toISOString(),
              },
            ],
          });
        }
      });
      if (newMessages.length > 0) setSubmittedMessages((prev) => [...prev, ...newMessages]);
    },
    [setSubmittedMessages],
  );

  /** 이미지가 아닌 파일을 미리보기 메시지로 추가 */
  const addFileMessagePreview = useCallback(
    (files: File[], senderId: number) => {
      const newMessages: ChatMessage[] = [];
      files.forEach((file) => {
        if (!file.type.startsWith("image/")) {
          const tempId = Date.now() + Math.random();
          newMessages.push({
            id: tempId,
            content: `파일: ${file.name}`,
            senderId,
            createdAt: new Date().toISOString(),
            attachments: [
              {
                id: tempId,
                isImage: false,
                url: URL.createObjectURL(file),
                thumbnailUrl: "",
                createdAt: new Date().toISOString(),
              },
            ],
          });
        }
      });
      if (newMessages.length > 0) setSubmittedMessages((prev) => [...prev, ...newMessages]);
    },
    [setSubmittedMessages],
  );

  // Cleanup created object URLs on unmount
  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current = [];
    };
  }, []);

  // --- 5. 최종 반환 객체 ---
  return {
    // Data & State
    messages: submittedMessages,
    connectionStatus,
    isLoading, // 초기 데이터 로딩 상태
    isFetchingNextPage, // 이전 기록 로딩 상태

    // Refs
    scrollContainerRef, // 실제 스크롤 컨테이너 ref
    messagesEndRef, // 자동 스크롤을 위한 ref
    topDetectorRef, // 무한 스크롤 감지를 위한 ref

    // Handlers
    sendTextMessage,
    sendImageMessage,
    addImageMessagePreview,
    addFileMessagePreview,
  };
};

export default useChatListHandler;
