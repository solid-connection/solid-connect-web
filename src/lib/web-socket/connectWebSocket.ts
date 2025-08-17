import SockJS from "sockjs-client";

import { convertToBearer } from "@/utils/axiosInstance";

import { getAccessTokenWithReissue } from "../zustand/useTokenStore";

import { ChatMessage, ConnectionStatus } from "@/types/chat";

import { Client } from "@stomp/stompjs";

interface ConnectWebSocketProps {
  roomId: number;
  setConnectionStatus: React.Dispatch<React.SetStateAction<ConnectionStatus>>;
  setSubmittedMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  clientRef: React.MutableRefObject<Client | null>;
}

const connectWebSocket = async ({
  roomId,
  setConnectionStatus,
  setSubmittedMessages,
  clientRef,
}: ConnectWebSocketProps) => {
  const token = await getAccessTokenWithReissue();
  if (!roomId || !token) return;

  const client = new Client({
    webSocketFactory: () => new SockJS(process.env.NEXT_PUBLIC_API_SERVER_URL) as WebSocket,
    connectHeaders: { Authorization: ` ${convertToBearer(token)}` },
    heartbeatIncoming: 20000,
    heartbeatOutgoing: 20000,
    debug: (str) => console.log(str),
  });

  client.onConnect = () => {
    setConnectionStatus(ConnectionStatus.Connected);
    client.subscribe(`/topic/chat/${roomId}`, (message) => {
      try {
        const receivedMessage = JSON.parse(message.body) as ChatMessage;
        setSubmittedMessages((prevMessages) => [...prevMessages, receivedMessage]);
      } catch (error) {}
    });
  };

  client.onStompError = (frame) => {
    setConnectionStatus(ConnectionStatus.Error);
  };

  client.onDisconnect = () => {
    setConnectionStatus(ConnectionStatus.Disconnected);
  };

  client.activate();
  clientRef.current = client;
};
export default connectWebSocket;
