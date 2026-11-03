"use client";

import Link from "next/link";
import { type ReactNode, useEffect, useRef } from "react";
import { useChatUserId } from "@/apis/chat";
import useAuthStore from "@/lib/zustand/useAuthStore";

const ChatAccess = ({ children }: { children: (userId: number) => ReactNode }) => {
  const userId = useChatUserId();
  const initialized = useAuthStore((state) => state.isInitialized);
  const loading = useAuthStore((state) => state.isLoading);
  const authenticated = useAuthStore((state) => state.isAuthenticated);
  const refreshStatus = useAuthStore((state) => state.refreshStatus);
  const lastValidatedUserId = useRef<number | null>(null);

  useEffect(
    function rememberValidatedIdentity() {
      if (userId) lastValidatedUserId.current = userId;
      else if (!authenticated) lastValidatedUserId.current = null;
    },
    [authenticated, userId],
  );

  // Token rotation must not destroy a room's draft. A failed refresh or logout still closes it immediately.
  const activeUserId = userId ?? (authenticated && refreshStatus !== "failed" ? lastValidatedUserId.current : null);
  if (activeUserId) return children(activeUserId);
  if (!initialized || loading) {
    return (
      <p role="status" className="px-5 py-16 text-center text-k-500">
        로그인 정보를 확인하고 있어요.
      </p>
    );
  }
  if (!activeUserId) {
    return (
      <div className="flex flex-col items-center gap-4 px-5 py-16">
        <p className="text-k-700">채팅하려면 로그인이 필요해요.</p>
        <Link href="/login" className="rounded-lg bg-primary px-6 py-3 text-white">
          로그인하기
        </Link>
      </div>
    );
  }
  return null;
};

export default ChatAccess;
