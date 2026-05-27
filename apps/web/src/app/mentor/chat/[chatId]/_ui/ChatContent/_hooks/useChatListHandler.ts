import type { Client } from "@stomp/stompjs";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import { ChatQueryKeys, useGetChatHistories } from "@/apis/chat";
import useConnectWebSocket from "@/lib/web-socket/useConnectWebSocket";
import { type ChatMessage, ConnectionStatus } from "@/types/chat";
import { normalizeImageUrlToUploadCdn } from "@/utils/cdnUrl";
// --- 프로젝트 내부 의존성 ---
import useInfinityScroll from "@/utils/useInfinityScroll";

const BOTTOM_PROXIMITY_THRESHOLD = 80;
const OUTBOUND_TEXT_SCROLL_CONFIRM_TIMEOUT_MS = 5000;

interface PendingOutboundTextScroll {
  id: string;
  senderId: number;
  content: string;
  timeoutId: ReturnType<typeof setTimeout>;
}

const getMessageDedupeKey = (message: ChatMessage): string => {
  if (message.id > 0) {
    return `id:${message.id}`;
  }

  const attachmentKey = message.attachments
    .map((attachment) => `${attachment.isImage ? "image" : "file"}:${attachment.url}:${attachment.createdAt}`)
    .join(",");

  return `fallback:${message.senderId}:${message.createdAt}:${message.content}:${attachmentKey}`;
};

const getImageUrlKeys = (url: string | null | undefined) => {
  if (!url) return [];

  const normalizedUrl = normalizeImageUrlToUploadCdn(url);
  return Array.from(new Set([url, normalizedUrl].filter((key) => key.length > 0)));
};

const normalizePendingText = (content: string) => content.trim();

const useChatListHandler = (chatId: number) => {
  // --- 1. State 및 Ref 선언 ---
  const clientRef = useRef<Client | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null); // 새 메시지 수신 시 자동 스크롤을 위한 ref
  const scrollContainerRef = useRef<HTMLDivElement>(null); // 실제 스크롤 컨테이너 ref
  const hasInitialAutoScrolledRef = useRef(false);
  const prevMessageCountRef = useRef(0);
  const prevChatIdRef = useRef(chatId);
  const shouldForceScrollToBottomRef = useRef(false);
  const pendingOutboundTextScrollsRef = useRef<PendingOutboundTextScroll[]>([]);
  const imagePreviewByUrlRef = useRef<Map<string, string>>(new Map());
  const objectUrlsRef = useRef<string[]>([]);
  const queryClient = useQueryClient();

  const scrollToBottom = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.scrollTop = container.scrollHeight;
  }, []);

  const removePendingOutboundTextScrolls = useCallback((ids: Set<string>) => {
    pendingOutboundTextScrollsRef.current = pendingOutboundTextScrollsRef.current.filter((item) => {
      if (!ids.has(item.id)) return true;

      clearTimeout(item.timeoutId);
      return false;
    });
  }, []);

  const clearPendingOutboundTextScrolls = useCallback(() => {
    pendingOutboundTextScrollsRef.current.forEach((item) => clearTimeout(item.timeoutId));
    pendingOutboundTextScrollsRef.current = [];
  }, []);

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

  const invalidateChatPreviewQueries = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [ChatQueryKeys.chatHistories, chatId], refetchType: "none" });
    queryClient.invalidateQueries({ queryKey: [ChatQueryKeys.chatRooms], refetchType: "none" });
  }, [chatId, queryClient]);

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

  useEffect(() => {
    if (imagePreviewByUrlRef.current.size === 0) return;

    const matchedPreviewUrls = new Set<string>();
    let hasChanged = false;

    const messagesWithPreviews = submittedMessages.map((message) => {
      let hasAttachmentChanged = false;
      const attachments = message.attachments.map((attachment) => {
        if (!attachment.isImage || attachment.previewUrl || attachment.isOptimistic) {
          return attachment;
        }

        const previewUrl = [...getImageUrlKeys(attachment.url), ...getImageUrlKeys(attachment.thumbnailUrl)]
          .map((key) => imagePreviewByUrlRef.current.get(key))
          .find((value): value is string => Boolean(value));

        if (!previewUrl) {
          return attachment;
        }

        hasAttachmentChanged = true;
        matchedPreviewUrls.add(previewUrl);
        return {
          ...attachment,
          previewUrl,
        };
      });

      if (!hasAttachmentChanged) {
        return message;
      }

      hasChanged = true;
      return {
        ...message,
        attachments,
      };
    });

    if (matchedPreviewUrls.size === 0) return;

    const reconciledMessages = messagesWithPreviews.filter((message) => {
      const shouldRemoveOptimisticMessage =
        message.attachments.length > 0 &&
        message.attachments.every(
          (attachment) =>
            attachment.isOptimistic && attachment.previewUrl && matchedPreviewUrls.has(attachment.previewUrl),
        );

      if (shouldRemoveOptimisticMessage) {
        hasChanged = true;
        return false;
      }

      return true;
    });

    if (!hasChanged) return;

    imagePreviewByUrlRef.current.forEach((previewUrl, key) => {
      if (matchedPreviewUrls.has(previewUrl)) {
        imagePreviewByUrlRef.current.delete(key);
      }
    });

    setSubmittedMessages(reconciledMessages);
  }, [submittedMessages, setSubmittedMessages]);

  // 채팅방 전환 시 자동 스크롤 상태를 초기화합니다.
  useEffect(() => {
    if (prevChatIdRef.current === chatId) return;

    objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    objectUrlsRef.current = [];
    imagePreviewByUrlRef.current.clear();
    clearPendingOutboundTextScrolls();
    prevChatIdRef.current = chatId;
    hasInitialAutoScrolledRef.current = false;
    prevMessageCountRef.current = 0;
    shouldForceScrollToBottomRef.current = false;
  }, [chatId, clearPendingOutboundTextScrolls]);

  // 초기 히스토리 로딩 완료 후, 최초 1회만 하단으로 이동합니다.
  useEffect(() => {
    if (isLoading || isFetchingNextPage || submittedMessages.length === 0 || hasInitialAutoScrolledRef.current) {
      return;
    }

    const rafId = requestAnimationFrame(() => {
      scrollToBottom();
      hasInitialAutoScrolledRef.current = true;
      prevMessageCountRef.current = submittedMessages.length;
    });

    return () => cancelAnimationFrame(rafId);
  }, [isLoading, isFetchingNextPage, scrollToBottom, submittedMessages.length]);

  // 신규 메시지 도착 시 하단 근처라면 유지하고, 내가 보낸 메시지는 현재 위치와 무관하게 하단으로 이동합니다.
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

    const newMessages = submittedMessages.slice(prevMessageCount);
    const matchedPendingOutboundTextIds = new Set<string>();
    const hasConfirmedOutboundText = newMessages.some((message) => {
      const pendingOutboundText = pendingOutboundTextScrollsRef.current.find(
        (item) => item.senderId === message.senderId && item.content === normalizePendingText(message.content),
      );

      if (!pendingOutboundText) return false;

      matchedPendingOutboundTextIds.add(pendingOutboundText.id);
      return true;
    });

    if (matchedPendingOutboundTextIds.size > 0) {
      removePendingOutboundTextScrolls(matchedPendingOutboundTextIds);
    }

    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    const shouldForceScrollToBottom = shouldForceScrollToBottomRef.current || hasConfirmedOutboundText;

    if (shouldForceScrollToBottom || distanceFromBottom <= BOTTOM_PROXIMITY_THRESHOLD) {
      const rafId = requestAnimationFrame(() => {
        scrollToBottom();
      });

      shouldForceScrollToBottomRef.current = false;
      prevMessageCountRef.current = currentMessageCount;

      return () => cancelAnimationFrame(rafId);
    }

    prevMessageCountRef.current = currentMessageCount;
  }, [isLoading, isFetchingNextPage, removePendingOutboundTextScrolls, scrollToBottom, submittedMessages]);

  // --- 4. Handler 함수 ---

  /** 텍스트 메시지를 WebSocket을 통해 서버로 전송합니다. */
  const sendTextMessage = useCallback(
    (content: string, senderId: number) => {
      const normalizedContent = normalizePendingText(content);
      if (normalizedContent === "") return; // 빈 메시지 전송 방지

      if (clientRef.current?.active && connectionStatus === ConnectionStatus.Connected) {
        // WebSocket으로 메시지 전송
        clientRef.current.publish({
          destination: `/publish/chat/${chatId}`,
          body: JSON.stringify({ content, senderId }),
        });

        const pendingTextScrollId = `${Date.now()}-${Math.random()}`;
        const timeoutId = setTimeout(() => {
          pendingOutboundTextScrollsRef.current = pendingOutboundTextScrollsRef.current.filter(
            (item) => item.id !== pendingTextScrollId,
          );
        }, OUTBOUND_TEXT_SCROLL_CONFIRM_TIMEOUT_MS);

        pendingOutboundTextScrollsRef.current.push({
          id: pendingTextScrollId,
          senderId,
          content: normalizedContent,
          timeoutId,
        });

        requestAnimationFrame(scrollToBottom);
        invalidateChatPreviewQueries();
      } else {
        // 여기에 메시지 전송 실패에 대한 UI 피드백 로직을 추가할 수 있습니다. (e.g., alert, toast)
      }
    },
    [chatId, connectionStatus, invalidateChatPreviewQueries, scrollToBottom],
  ); // chatId와 connectionStatus가 변경될 경우에만 함수를 재생성

  const sendImageMessage = useCallback(
    (imageUrls: string[], previewUrls: string[] = []) => {
      if (imageUrls.length === 0) return false;

      if (clientRef.current?.active && connectionStatus === ConnectionStatus.Connected) {
        imageUrls.forEach((imageUrl, index) => {
          const previewUrl = previewUrls[index];
          if (!previewUrl) return;

          getImageUrlKeys(imageUrl).forEach((key) => {
            imagePreviewByUrlRef.current.set(key, previewUrl);
          });
        });

        clientRef.current.publish({
          destination: `/publish/chat/${chatId}/image`,
          body: JSON.stringify({ imageUrls }),
        });
        invalidateChatPreviewQueries();

        return true;
      }

      return false;
    },
    [chatId, connectionStatus, invalidateChatPreviewQueries],
  );

  /** 이미지 파일만 미리보기 메시지로 추가 */
  const addImageMessagePreview = useCallback(
    (files: File[], senderId: number) => {
      const newMessages: ChatMessage[] = [];
      const previewUrls: string[] = [];
      files.forEach((file) => {
        if (file.type.startsWith("image/")) {
          const tempId = Date.now() + Math.random();
          const imageUrl = URL.createObjectURL(file);
          objectUrlsRef.current.push(imageUrl);
          previewUrls.push(imageUrl);
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
                previewUrl: imageUrl,
                isOptimistic: true,
                createdAt: new Date().toISOString(),
              },
            ],
          });
        }
      });
      if (newMessages.length > 0) {
        shouldForceScrollToBottomRef.current = true;
        setSubmittedMessages((prev) => [...prev, ...newMessages]);
      }
      return previewUrls;
    },
    [setSubmittedMessages],
  );

  const removeImageMessagePreviews = useCallback(
    (previewUrls: string[]) => {
      if (previewUrls.length === 0) return;

      const previewUrlSet = new Set(previewUrls);
      previewUrls.forEach((previewUrl) => {
        URL.revokeObjectURL(previewUrl);
      });
      objectUrlsRef.current = objectUrlsRef.current.filter((objectUrl) => !previewUrlSet.has(objectUrl));

      setSubmittedMessages((prev) =>
        prev.filter(
          (message) =>
            message.attachments.length === 0 ||
            !message.attachments.every(
              (attachment) =>
                attachment.isOptimistic && attachment.previewUrl && previewUrlSet.has(attachment.previewUrl),
            ),
        ),
      );
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
                thumbnailUrl: null,
                createdAt: new Date().toISOString(),
              },
            ],
          });
        }
      });
      if (newMessages.length > 0) {
        shouldForceScrollToBottomRef.current = true;
        setSubmittedMessages((prev) => [...prev, ...newMessages]);
      }
    },
    [setSubmittedMessages],
  );

  // Cleanup created object URLs on unmount
  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current = [];
      clearPendingOutboundTextScrolls();
    };
  }, [clearPendingOutboundTextScrolls]);

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
    removeImageMessagePreviews,
    addFileMessagePreview,
  };
};

export default useChatListHandler;
