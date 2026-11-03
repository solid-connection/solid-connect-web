import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { parseChatMessage } from "@/apis/chat/normalize";
import type { ChatPayload, ChatTransport, ChatTransportEvents } from "./types";

interface StompTransportOptions extends ChatTransportEvents {
  roomId: number;
  getAccessToken(): Promise<string | null>;
}

// Every reconnect obtains a new token. No message is replayed by the transport.
export const createStompTransport = (options: StompTransportOptions): ChatTransport => {
  let current: Client | null = null;
  let running = false;
  let generation = 0;
  let hasConnected = false;

  const disposeClient = () => {
    generation += 1;
    const previous = current;
    current = null;
    if (previous) void previous.deactivate();
  };

  const connect = () => {
    disposeClient();
    if (!running) return;
    if (!navigator.onLine) {
      options.onConnection("offline");
      return;
    }

    const connectionGeneration = generation;
    let token = "";
    const isCurrent = () => running && connectionGeneration === generation;
    const client = new Client({
      webSocketFactory: () => {
        if (!isCurrent() || !token) throw new Error("채팅 연결이 종료되었습니다.");
        const apiUrl = process.env.NEXT_PUBLIC_API_SERVER_URL;
        if (!apiUrl) throw new Error("채팅 서버 주소를 확인할 수 없습니다.");
        return new SockJS(`${apiUrl.replace(/\/$/, "")}/connect?token=${encodeURIComponent(token)}`);
      },
      connectionTimeout: 10000,
      reconnectDelay: 3000,
      heartbeatIncoming: 20000,
      heartbeatOutgoing: 20000,
    });

    client.beforeConnect = async () => {
      if (!isCurrent()) return;
      options.onConnection(hasConnected ? "reconnecting" : "connecting");
      try {
        const latestToken = await options.getAccessToken();
        if (!isCurrent()) return;
        if (!latestToken) throw new Error("로그인이 필요합니다.");
        token = latestToken;
      } catch {
        if (!isCurrent()) return;
        options.onConnection("error");
        disposeClient();
      }
    };

    client.onConnect = () => {
      if (!isCurrent()) return;
      hasConnected = true;
      client.subscribe(`/topic/chat/${options.roomId}`, (frame) => {
        if (!isCurrent()) return;
        try {
          const message = parseChatMessage(JSON.parse(frame.body));
          if (message) options.onMessage(message);
        } catch {
          // A malformed frame must not tear down a working subscription.
        }
      });
      options.onConnection("connected");
      options.onConnected();
    };
    client.onWebSocketClose = () => {
      if (isCurrent()) options.onConnection(navigator.onLine ? "reconnecting" : "offline");
    };
    client.onWebSocketError = () => {
      if (isCurrent()) options.onConnection(navigator.onLine ? "reconnecting" : "offline");
    };
    client.onStompError = () => {
      if (!isCurrent()) return;
      options.onConnection("error");
      // Broker errors require an explicit retry instead of an endless reconnect loop.
      disposeClient();
    };
    current = client;
    client.activate();
  };

  const onOffline = () => {
    disposeClient();
    if (running) options.onConnection("offline");
  };
  const onOnline = () => connect();

  return {
    start() {
      if (running) return;
      running = true;
      window.addEventListener("offline", onOffline);
      window.addEventListener("online", onOnline);
      connect();
    },
    stop() {
      running = false;
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
      disposeClient();
    },
    reconnect() {
      if (running) connect();
    },
    publish(payload: ChatPayload) {
      if (!running || !current?.connected || !navigator.onLine) {
        throw new Error("채팅 연결을 확인해주세요. 입력한 내용은 보관됩니다.");
      }
      current.publish({
        destination: `/publish/chat/${options.roomId}${"imageUrls" in payload ? "/image" : ""}`,
        body: JSON.stringify(payload),
      });
    },
  };
};
