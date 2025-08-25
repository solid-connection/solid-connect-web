import { useEffect, useState } from "react";
import type { MutableRefObject } from "react";

import SockJS from "sockjs-client";

import { convertToBearer } from "@/utils/axiosInstance";

import { getAccessTokenWithReissue } from "../zustand/useTokenStore";

import { ChatMessage, ConnectionStatus } from "@/types/chat";

import { Client } from "@stomp/stompjs";

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

  useEffect(() => {
    if (!roomId) {
      setConnectionStatus(ConnectionStatus.Disconnected);
      return;
    }

    const connect = async () => {
      setConnectionStatus(ConnectionStatus.Pending); // 연결 시도 중 상태로 설정
      const token = await getAccessTokenWithReissue();

      // 연결 시도 중 상태로 설정
      try {
        const client = new Client({
          webSocketFactory: () => new SockJS(`${NEXT_PUBLIC_API_SERVER_URL}/connect?token=${token}`),
          beforeConnect: async () => {
            if (!token) throw new Error("Access token is not available.");
            client.connectHeaders = {
              Authorization: convertToBearer(token),
            };
          },

          heartbeatIncoming: 20000,
          heartbeatOutgoing: 20000,
          reconnectDelay: 10000,
          debug: (str) => {
            if (process.env.NODE_ENV === "development") {
              console.log(new Date(), str);
            }
          },
        });

        client.onConnect = () => {
          setConnectionStatus(ConnectionStatus.Connected);
          client.subscribe(`/topic/chat/${roomId}`, (message) => {
            try {
              const receivedMessage = JSON.parse(message.body) as ChatMessage;
              setSubmittedMessages((prev) => [...prev, receivedMessage]);
            } catch (error) {
              console.error("Failed to parse message body:", error);
            }
          });
        };

        client.onStompError = (frame) => {
          console.error("Broker reported error: " + frame.headers["message"]);
          console.error("Additional details: " + frame.body);
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
  }, [roomId, setSubmittedMessages, clientRef]);

  // 관리하는 connectionStatus를 반환
  return { connectionStatus, submittedMessages, setSubmittedMessages };
};

export default useConnectWebSocket;
