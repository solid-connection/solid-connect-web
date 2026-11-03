import type { ChatMessage } from "@/types/chat";

export type ChatConnection = "connecting" | "connected" | "reconnecting" | "offline" | "error" | "disconnected";

export type OutgoingMessage = {
  clientId: string;
  content: string;
  imageUrls: string[];
  remainingImageUrls: string[];
  senderId: number;
  createdAt: string;
  status: "pending" | "unconfirmed";
};

export type ChatSnapshot = {
  messages: ChatMessage[];
  outgoing: OutgoingMessage[];
  connection: ChatConnection;
  historyStatus: "loading" | "ready" | "error";
  historyError: string | null;
  syncError: string | null;
  olderError: string | null;
  isSyncing: boolean;
  isLoadingOlder: boolean;
  hasMore: boolean;
  accessDenied: boolean;
  readError: boolean;
};

export type ChatPayload = { content: string; senderId: number } | { imageUrls: string[] };

export interface ChatTransport {
  start(): void;
  stop(): void;
  reconnect(): void;
  publish(payload: ChatPayload): void;
}

export interface ChatTransportEvents {
  onConnection(state: ChatConnection): void;
  onConnected(): void;
  onMessage(message: ChatMessage): void;
}
