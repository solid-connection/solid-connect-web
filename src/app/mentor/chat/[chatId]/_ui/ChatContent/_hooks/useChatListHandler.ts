import { useEffect, useRef, useState } from "react";

import useInfinityScroll from "@/utils/useInfinityScroll";

import { ChatMessage, ConnectionStatus } from "@/types/chat";

import useGetChatHistories from "@/api/chat/clients/useGetChatHistories";
import connectWebSocket from "@/lib/web-socket/connectWebSocket";
import { Client } from "@stomp/stompjs";

const useChatListHandler = (chatId: number) => {
  const [submittedMessages, setSubmittedMessages] = useState<ChatMessage[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.Disconnected);

  // 채팅 메시지 영역 스크롤 참조
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<Client | null>(null);

  // API로부터 채팅 히스토리 가져오기
  const {
    data: chatHistoryData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetChatHistories(chatId);

  // 무한 스크롤을 위한 ref (첫 번째 메시지에 부착하여 위로 스크롤 시 더 오래된 메시지 로드)
  const { lastElementRef: firstRef } = useInfinityScroll({ fetchNextPage, hasNextPage, isDirectionTop: true });

  // 채팅 기록을 시간 순서대로 정렬하여 상태에 설정
  useEffect(() => {
    if (chatHistoryData?.messages) {
      // API에서 가져온 메시지들을 시간 순서대로 정렬 (오래된 것부터)
      const sortedMessages = [...chatHistoryData.messages].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

      // 기존 더미 메시지와 합치지 않고 API 데이터만 사용
      setSubmittedMessages(sortedMessages);
    }
  }, [chatHistoryData]);

  // WebSocket 연결 및 실시간 메시지 수신
  useEffect(() => {
    connectWebSocket({ roomId: chatId, setConnectionStatus, setSubmittedMessages, clientRef });
    return () => {
      if (clientRef.current?.connected) {
        clientRef.current.deactivate();
      }
    };
  }, [chatId]);

  // 메시지가 변경될 때마다 스크롤을 맨 아래로
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [submittedMessages]);

  // 새 메시지 추가 함수
  const addMessage = (newMessage: ChatMessage) => {
    setSubmittedMessages((prev) => [...prev, newMessage]);
  };

  // 텍스트 메시지 전송 함수
  const sendTextMessage = (content: string, senderId: number) => {
    if (clientRef.current && clientRef.current.connected) {
      // WebSocket으로 메시지 전송
      clientRef.current.publish({
        destination: `/publish/chat/${chatId}`,
        body: JSON.stringify({ content, senderId }),
      });
    } else {
      console.error("Cannot send message, stomp client is not connected.");
      // WebSocket이 연결되지 않은 경우 로컬에만 추가 (임시)
      const newMessage: ChatMessage = {
        id: Date.now(),
        content,
        senderId,
        createdAt: new Date().toISOString(),
        attachments: [],
      };
      addMessage(newMessage);
    }
  };

  // 이미지 메시지 추가 함수
  const addImageMessage = (images: File[], senderId: number) => {
    const imageAttachments = images.map((image) => ({
      id: Date.now() + Math.random(), // 임시 ID
      isImage: true,
      url: URL.createObjectURL(image),
      thumbnailUrl: URL.createObjectURL(image),
      createdAt: new Date().toISOString(),
    }));

    const newMessage: ChatMessage = {
      id: Date.now(), // 임시 ID
      content: `${images.length}개의 이미지를 전송했습니다.`,
      senderId,
      createdAt: new Date().toISOString(),
      attachments: imageAttachments,
    };
    addMessage(newMessage);
  };

  // 파일 메시지 추가 함수
  const addFileMessage = (files: File[], senderId: number) => {
    const fileAttachments = files.map((file) => ({
      id: Date.now() + Math.random(), // 임시 ID
      isImage: false,
      url: URL.createObjectURL(file),
      thumbnailUrl: "", // 파일은 썸네일이 없음
      createdAt: new Date().toISOString(),
    }));

    const newMessage: ChatMessage = {
      id: Date.now(), // 임시 ID
      content: `${files.length}개의 파일을 전송했습니다.`,
      senderId,
      createdAt: new Date().toISOString(),
      attachments: fileAttachments,
    };
    addMessage(newMessage);
  };

  return {
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
  };
};
export default useChatListHandler;
