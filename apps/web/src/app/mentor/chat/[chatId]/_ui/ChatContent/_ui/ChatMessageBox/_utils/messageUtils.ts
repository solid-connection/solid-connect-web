import type { ChatMessage } from "@/types/chat";

// 메시지 타입 enum
export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  FILE = "file",
}

// 메시지 타입 구분 함수
export const getMessageType = (message: ChatMessage): MessageType => {
  const hasAttachments = message.attachments && message.attachments.length > 0;

  if (hasAttachments) {
    // 첨부파일이 있는 경우 - 이미지인지 파일인지 구분
    const allImages = message.attachments.every((attachment) => attachment.isImage);
    return allImages ? MessageType.IMAGE : MessageType.FILE;
  }

  // 첨부파일이 없는 경우는 모두 TEXT로 처리
  return MessageType.TEXT;
};

// content를 표시할지 결정하는 함수
export const shouldShowContent = (message: MessageType): boolean => {
  return MessageType.TEXT === message;
};
