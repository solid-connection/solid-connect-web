export interface ChatRoom {
  id: number;
  lastChatMessage: string;
  lastReceivedTime: string; // ISO8601 형식 (e.g. "2025-01-27T17:30:00Z")
  partner: ChatPartner;
  unReadCount: number;
}

export interface ChatPartner {
  partnerId: number;
  nickname: string;
  profileUrl: string | null;
  university: string | null;
}

export interface ChatAttachment {
  id: number;
  isImage: boolean;
  url: string;
  thumbnailUrl: string;
  createdAt: string;
}

export interface ChatMessage {
  id: number;
  content: string;
  senderId: number;
  createdAt: string;
  attachments: ChatAttachment[];
}

export enum ConnectionStatus {
  Connected = "Connected",
  Disconnected = "Disconnected",
  Error = "Error",
}
