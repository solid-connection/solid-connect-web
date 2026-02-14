import type { Client } from "@stomp/stompjs";
import { useCallback, useEffect, useRef } from "react";
import { useGetChatHistories } from "@/apis/chat";
import useConnectWebSocket from "@/lib/web-socket/useConnectWebSocket";
import { type ChatMessage, ConnectionStatus } from "@/types/chat";
// --- 프로젝트 내부 의존성 ---
import useInfinityScroll from "@/utils/useInfinityScroll";

const useChatListHandler = (chatId: number) => {
  // --- 1. State 및 Ref 선언 ---
  const clientRef = useRef<Client | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null); // 새 메시지 수신 시 자동 스크롤을 위한 ref

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
      const seenIds = new Set<string | number>();
      for (let i = sortedMessages.length - 1; i >= 0; i--) {
        const msg = sortedMessages[i];
        if (!seenIds.has(msg.id)) {
          seenIds.add(msg.id);
          dedupedMessages.unshift(msg);
        }
      }
      setSubmittedMessages(dedupedMessages);
    }
  }, [chatHistoryPages, setSubmittedMessages]);

  // 새로운 메시지가 추가되었을 때, 스크롤을 대화 목록의 맨 아래로 이동시킵니다.
  useEffect(() => {
    // 이전 기록을 불러오는 중일 때는 자동 스크롤을 방지하여 사용자 경험을 해치지 않습니다.
    if (!isFetchingNextPage && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
  }, [isFetchingNextPage]);

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
        console.error("WebSocket is not connected. Message could not be sent.");
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

      console.error("WebSocket is not connected. Image message could not be sent.");
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
