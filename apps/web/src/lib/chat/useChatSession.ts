"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useSyncExternalStore } from "react";
import { chatApi, chatKeys, getChatUserId } from "@/apis/chat";
import { imageUploadApi } from "@/apis/image-upload/api";
import useAuthStore from "@/lib/zustand/useAuthStore";
import { getValidAccessToken } from "@/utils/axiosInstance";
import { ChatSession } from "./ChatSession";
import { createStompTransport } from "./stompTransport";
import type { OutgoingMessage } from "./types";

export const useChatSession = (roomId: number, userId: number, enabled: boolean) => {
  const queryClient = useQueryClient();
  const session = useMemo(
    () =>
      new ChatSession({
        userId,
        loadHistory: (page, signal) => chatApi.getChatHistories({ roomId, page, signal }),
        markRead: (signal) => chatApi.putReadChatRoom(roomId, signal),
        createTransport: (events) => createStompTransport({ roomId, getAccessToken: getValidAccessToken, ...events }),
        initialOutgoing: queryClient.getQueryData<OutgoingMessage[]>(chatKeys.outbox(userId, roomId)),
        saveOutgoing: (outgoing) => {
          const auth = useAuthStore.getState();
          if (auth.isAuthenticated && getChatUserId(auth.accessToken) === userId) {
            queryClient.setQueryData(chatKeys.outbox(userId, roomId), outgoing);
          }
        },
        onMessagesChanged: () => {
          void queryClient.invalidateQueries({ queryKey: chatKeys.rooms(userId) });
        },
        onRead: () => {
          void queryClient.invalidateQueries({ queryKey: chatKeys.rooms(userId) });
        },
      }),
    [queryClient, roomId, userId],
  );
  const snapshot = useSyncExternalStore(session.subscribe, session.getSnapshot, session.getSnapshot);

  useEffect(
    function manageRoomSession() {
      // Unconfirmed sends survive route changes in memory and are cleared with the login cache.
      queryClient.setQueryDefaults(chatKeys.outbox(userId, roomId), { gcTime: Infinity });
      if (!enabled) return;
      session.start();
      const synchronizeVisibleRoom = () => {
        if (document.visibilityState === "visible") void session.syncLatest();
      };
      window.addEventListener("focus", synchronizeVisibleRoom);
      document.addEventListener("visibilitychange", synchronizeVisibleRoom);
      return function stopRoomSession() {
        window.removeEventListener("focus", synchronizeVisibleRoom);
        document.removeEventListener("visibilitychange", synchronizeVisibleRoom);
        session.stop();
      };
    },
    [enabled, queryClient, roomId, session, userId],
  );

  return {
    session,
    snapshot,
    sendText: async (content: string) => session.publish({ content: content.trim(), senderId: userId }),
    sendImages: (files: File[]) => session.sendImages(files, imageUploadApi.postUploadChatImages),
  };
};
