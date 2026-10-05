"use client";

import { useEffect, useRef, useState } from "react";
import AppleScriptLoader from "@/lib/ScriptLoader/AppleScriptLoader";
import { IconAppleLogo } from "@/public/svgs/auth";
import { appleLogin } from "@/utils/authUtils";

const APPLE_SDK_LOAD_TIMEOUT_MS = 15_000;

const isAppleSdkReady = () =>
  typeof window.AppleID?.auth?.init === "function" && typeof window.AppleID?.auth?.signIn === "function";

type AppleSdkStatus = "loading" | "ready" | "error";

const AppleLoginButton = ({ redirectPath }: { redirectPath?: string }) => {
  const [sdkStatus, setSdkStatus] = useState<AppleSdkStatus>("loading");
  const [retryKey, setRetryKey] = useState<string | null>(null);
  const activeRetryKey = useRef<string | null>(null);

  useEffect(
    function waitForAppleSdk() {
      if (isAppleSdkReady()) {
        setSdkStatus("ready");
        return;
      }

      if (sdkStatus !== "loading") {
        return;
      }

      const timeoutId = window.setTimeout(() => setSdkStatus("error"), APPLE_SDK_LOAD_TIMEOUT_MS);
      return () => window.clearTimeout(timeoutId);
    },
    [sdkStatus],
  );

  const handleScriptReady = () => {
    setSdkStatus(isAppleSdkReady() ? "ready" : "error");
  };

  const handleScriptError = () => {
    if (activeRetryKey.current !== retryKey) {
      return;
    }

    setSdkStatus(isAppleSdkReady() ? "ready" : "error");
  };

  const handleRetry = () => {
    // next/script는 실패한 src도 캐시하므로 새 요청 URL로 다시 로드합니다.
    const nextRetryKey = window.crypto.randomUUID();
    activeRetryKey.current = nextRetryKey;
    setRetryKey(nextRetryKey);
    setSdkStatus("loading");
  };

  const handleLogin = () => {
    if (sdkStatus !== "ready") {
      return;
    }

    // 팝업이 차단되지 않도록 사용자 클릭 중에 signIn을 바로 호출합니다.
    // 로그인 실패 안내는 appleLogin에서 표시합니다.
    void appleLogin(redirectPath).catch(() => undefined);
  };

  return (
    <div className="mx-5">
      <AppleScriptLoader
        key={retryKey ?? "initial"}
        retryKey={retryKey}
        onReady={handleScriptReady}
        onError={handleScriptError}
      />
      <button
        onClick={handleLogin}
        type="button"
        disabled={sdkStatus !== "ready"}
        aria-busy={sdkStatus === "loading"}
        aria-describedby={sdkStatus === "ready" ? undefined : "apple-login-status"}
        className="flex h-11 w-full items-center justify-center gap-[5px] rounded-lg bg-black p-2.5 transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <IconAppleLogo />
        <span className="text-white">애플로 시작하기</span>
      </button>
      {sdkStatus !== "ready" && (
        <p id="apple-login-status" aria-live="polite" className="mt-2 text-center text-k-500 typo-regular-4">
          {sdkStatus === "loading" ? "애플 로그인을 준비하고 있어요." : "애플 로그인을 준비하지 못했어요."}
        </p>
      )}
      {sdkStatus === "error" && (
        <button
          type="button"
          onClick={handleRetry}
          className="mx-auto mt-1 block text-primary underline underline-offset-2 typo-medium-4"
        >
          애플 로그인 다시 준비하기
        </button>
      )}
    </div>
  );
};

export default AppleLoginButton;
