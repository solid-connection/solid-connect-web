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
}
