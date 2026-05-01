import type { ChatAttachment, ChatMessage, ChatPartner, ChatRoom } from "@/types/chat";

type NumericLike = number | string | null | undefined;

interface RawChatAttachment {
  id?: NumericLike;
  isImage: boolean;
  url: string;
  thumbnailUrl?: string | null;
  createdAt: string;
}

export interface RawChatMessage {
  id?: NumericLike;
  content: string;
  senderId?: NumericLike;
  siteUserId?: NumericLike;
  createdAt: string;
  attachments?: RawChatAttachment[];
}

export interface RawChatPartner {
  partnerId?: NumericLike;
  siteUserId?: NumericLike;
  nickname: string;
  profileUrl?: string | null;
  university?: string | null;
}

export interface RawChatRoom {
  id: number;
  lastChatMessage: string;
  lastReceivedTime: string;
  partner: RawChatPartner;
  unReadCount: number;
}

const toNumber = (value: NumericLike): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};

const createStableHash = (value: string): number => {
  let hash = 0;

  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }

  const normalized = Math.abs(hash);
  return normalized === 0 ? 1 : normalized;
};

const getFallbackMessageId = (message: RawChatMessage): number => {
  const senderId = toNumber(message.senderId ?? message.siteUserId);
  const attachmentSignature = (message.attachments ?? [])
    .map((attachment) => `${attachment.isImage ? "image" : "file"}:${attachment.url}:${attachment.createdAt}`)
    .join(",");
  const seed = `${senderId}|${message.createdAt}|${message.content}|${attachmentSignature}`;

  // 서버에서 id가 누락되는 경우를 대비해 항상 동일한 임시 음수 id를 생성합니다.
  return -createStableHash(seed);
};

const normalizeAttachment = (attachment: RawChatAttachment): ChatAttachment => ({
  id: toNumber(attachment.id),
  isImage: attachment.isImage,
  url: attachment.url,
  thumbnailUrl: attachment.thumbnailUrl ?? "",
  createdAt: attachment.createdAt,
});

export const normalizeChatMessage = (message: RawChatMessage): ChatMessage => {
  const parsedId = toNumber(message.id);
  const normalizedId = parsedId > 0 ? parsedId : getFallbackMessageId(message);

  return {
    id: normalizedId,
    content: message.content,
    senderId: toNumber(message.senderId ?? message.siteUserId),
    createdAt: message.createdAt,
    attachments: (message.attachments ?? []).map(normalizeAttachment),
  };
};

export const normalizeChatPartner = (partner: RawChatPartner): ChatPartner => ({
  partnerId: toNumber(partner.partnerId ?? partner.siteUserId),
  nickname: partner.nickname,
  profileUrl: partner.profileUrl ?? null,
  university: partner.university ?? null,
});

export const normalizeChatRoom = (room: RawChatRoom): ChatRoom => ({
  id: room.id,
  lastChatMessage: room.lastChatMessage,
  lastReceivedTime: room.lastReceivedTime,
  partner: normalizeChatPartner(room.partner),
  unReadCount: room.unReadCount,
});
