import { Client } from "@stomp/stompjs";
import type { MutableRefObject } from "react";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";

import { type ChatMessage, ConnectionStatus } from "@/types/chat";
import useAuthStore from "../zustand/useAuthStore";

interface UseConnectWebSocketProps {
  roomId: number | null;
  clientRef: MutableRefObject<Client | null>;
}

interface UseConnectWebSocketReturn {
  connectionStatus: ConnectionStatus;
  submittedMessages: ChatMessage[];
  setSubmittedMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const NEXT_PUBLIC_API_SERVER_URL = process.env.NEXT_PUBLIC_API_SERVER_URL;

const useConnectWebSocket = ({ roomId, clientRef }: UseConnectWebSocketProps): UseConnectWebSocketReturn => {
  // Hook 내부에서 연결 상태를 직접 관리
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.Disconnected);
  const [submittedMessages, setSubmittedMessages] = useState<ChatMessage[]>([]);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    if (!roomId) {
      setConnectionStatus(ConnectionStatus.Disconnected);
      return;
    }

    if (!isInitialized || !accessToken || accessToken.trim() === "") {
      setConnectionStatus(ConnectionStatus.Pending);
      return;
    }

    const connect = async () => {
      setConnectionStatus(ConnectionStatus.Pending); // 연결 시도 중 상태로 설정
      const token = accessToken;

      try {
        const client = new Client({
          webSocketFactory: () => new SockJS(`${NEXT_PUBLIC_API_SERVER_URL}/connect?token=${token}`),
          // ...existing code...
          heartbeatIncoming: 50000,
          heartbeatOutgoing: 50000,
          reconnectDelay: 50000,
        });

        client.onConnect = () => {
          setConnectionStatus(ConnectionStatus.Connected);
          client.subscribe(`/topic/chat/${roomId}`, (message) => {
            try {
              const receivedMessage = JSON.parse(message.body) as ChatMessage;

              if (!receivedMessage.createdAt || Number.isNaN(new Date(receivedMessage.createdAt).getTime())) {
                receivedMessage.createdAt = new Date().toISOString();
              }

              setSubmittedMessages((prev) => [...prev, receivedMessage]);
            } catch (error) {
              console.error("Failed to parse message body:", error);
            }
          });
        };

        client.onStompError = (frame) => {
          console.error(`Broker reported error: ${frame.headers.message}`);
          console.error(`Additional details: ${frame.body}`);
          setConnectionStatus(ConnectionStatus.Error);
        };

        client.onDisconnect = () => {
          setConnectionStatus(ConnectionStatus.Disconnected);
        };

        client.activate();
        clientRef.current = client;
      } catch (error) {
        console.error("Failed to connect WebSocket:", error);
        setConnectionStatus(ConnectionStatus.Error);
      }
    };

    connect();

    // Clean-up 함수
    return () => {
      if (clientRef.current?.active) {
        clientRef.current.deactivate();
      }
      clientRef.current = null;
    };
  }, [roomId, clientRef, accessToken, isInitialized]);

  // 관리하는 connectionStatus를 반환
  return { connectionStatus, submittedMessages, setSubmittedMessages };
};

export default useConnectWebSocket;
