import { useEffect, useState } from "react";

import useInfinityScroll from "@/utils/useInfinityScroll";

import { ChatMessage } from "@/types/chat";

import useGetChatHistories from "@/api/chat/clients/useGetChatHistories";

// 더미 채팅 데이터
const messages: ChatMessage[] = [
  {
    id: 1,
    content: "안녕하세요!\n질문이 있어서 연락드렸습니다!",
    senderId: 2,
    createdAt: "2025-06-12T12:02:00Z",
    attachments: [],
  },
  {
    id: 2,
    content: "안녕하세요! 무엇이든 물어보세요!",
    senderId: 1,
    createdAt: "2025-06-12T12:06:00Z",
    attachments: [],
  },
  {
    id: 3,
    content: "감사합니다! 도움이 많이 됐어요!",
    senderId: 2,
    createdAt: "2025-06-13T12:07:00Z",
    attachments: [],
  },
  {
    id: 3,
    content: "감사합니다! 도움이 많이 됐어요!",
    senderId: 2,
    createdAt: "2025-06-13T12:07:00Z",
    attachments: [],
  },
  {
    id: 3,
    content: "감사합니다! 도움이 많이 됐어요!",
    senderId: 2,
    createdAt: "2025-06-13T12:07:00Z",
    attachments: [],
  },
  {
    id: 3,
    content: "감사합니다! 도움이 많이 됐어요!",
    senderId: 2,
    createdAt: "2025-06-13T12:07:00Z",
    attachments: [],
  },
  {
    id: 3,
    content: "감사합니다! 도움이 많이 됐어요!",
    senderId: 2,
    createdAt: "2025-06-13T12:07:00Z",
    attachments: [],
  },
];

const useChatListHandler = (roomId: number) => {
  const [submittedMessages, setSubmittedMessages] = useState<ChatMessage[]>(messages);

  const {
    data: chatHistoryData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetChatHistories(roomId);

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

  // 새 메시지 추가 함수
  const addMessage = (newMessage: ChatMessage) => {
    setSubmittedMessages((prev) => [...prev, newMessage]);
  };

  // 텍스트 메시지 추가 함수
  const addTextMessage = (content: string, senderId: number) => {
    const newMessage: ChatMessage = {
      id: Date.now(), // 임시 ID
      content,
      senderId,
      createdAt: new Date().toISOString(),
      attachments: [],
    };
    addMessage(newMessage);
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
    addMessage,
    addTextMessage,
    addImageMessage,
    addFileMessage,
    firstRef,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    setSubmittedMessages,
  };
};
export default useChatListHandler;
