"use client";

import Link from "next/link";
import { type ReactNode, useEffect, useRef } from "react";
import { useChatUserId } from "@/apis/chat";
import useAuthStore from "@/lib/zustand/useAuthStore";
import { getValidAccessToken } from "@/utils/axiosInstance";

const ChatAccess = ({
  children,
  fallbackHeader,
}: {
  children: (userId: number) => ReactNode;
  fallbackHeader?: ReactNode;
}) => {
  const userId = useChatUserId();
  const initialized = useAuthStore((state) => state.isInitialized);
  const loading = useAuthStore((state) => state.isLoading);
  const authenticated = useAuthStore((state) => state.isAuthenticated);
  const refreshStatus = useAuthStore((state) => state.refreshStatus);
  const sessionVersion = useAuthStore((state) => state.sessionVersion);
  const lastValidatedIdentity = useRef<{ userId: number; sessionVersion: number } | null>(null);

  useEffect(
    function rememberValidatedIdentity() {
      if (userId) lastValidatedIdentity.current = { userId, sessionVersion };
      else if (!authenticated) lastValidatedIdentity.current = null;
    },
    [authenticated, sessionVersion, userId],
  );

  // Token rotation must not destroy a room's draft. A failed refresh or logout still closes it immediately.
  const rememberedIdentity = lastValidatedIdentity.current;
  const activeUserId =
    userId ??
    (authenticated && refreshStatus !== "failed" && rememberedIdentity?.sessionVersion === sessionVersion
      ? rememberedIdentity.userId
      : null);

  useEffect(
    function refreshIdentityOnChatEntry() {
      if (!initialized || !authenticated || activeUserId || useAuthStore.getState().sessionVersion !== sessionVersion)
        return;
      void getValidAccessToken().catch(() => {});
    },
    [initialized, authenticated, activeUserId, sessionVersion],
  );

  if (activeUserId) return children(activeUserId);
  if (initialized && authenticated && !loading && refreshStatus === "retryable") {
    return (
      <>
        {fallbackHeader}
        <div className="flex flex-col items-center gap-4 px-5 py-16">
          <p role="alert" className="text-k-700">
            로그인 정보를 확인하지 못했어요. 다시 시도해주세요.
          </p>
          <button
            type="button"
            className="rounded-lg bg-primary px-6 py-3 text-white"
            onClick={() => void getValidAccessToken().catch(() => {})}
          >
            다시 확인
          </button>
        </div>
      </>
    );
  }
  if (!initialized || loading || authenticated) {
    return (
      <>
        {fallbackHeader}
        <p role="status" className="px-5 py-16 text-center text-k-500">
          로그인 정보를 확인하고 있어요.
        </p>
      </>
    );
  }
  if (!activeUserId) {
    return (
      <>
        {fallbackHeader}
        <div className="flex flex-col items-center gap-4 px-5 py-16">
          <p className="text-k-700">채팅하려면 로그인이 필요해요.</p>
          <Link href="/login" className="rounded-lg bg-primary px-6 py-3 text-white">
            로그인하기
          </Link>
        </div>
      </>
    );
  }
  return null;
};

export default ChatAccess;
