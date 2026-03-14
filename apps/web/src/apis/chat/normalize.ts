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

const normalizeAttachment = (attachment: RawChatAttachment): ChatAttachment => ({
  id: toNumber(attachment.id),
  isImage: attachment.isImage,
  url: attachment.url,
  thumbnailUrl: attachment.thumbnailUrl ?? "",
  createdAt: attachment.createdAt,
});

export const normalizeChatMessage = (message: RawChatMessage): ChatMessage => ({
  id: toNumber(message.id),
  content: message.content,
  senderId: toNumber(message.senderId ?? message.siteUserId),
  createdAt: message.createdAt,
  attachments: (message.attachments ?? []).map(normalizeAttachment),
});

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
