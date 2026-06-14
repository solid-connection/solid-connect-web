import { showIconToast } from "@/lib/toast/showIconToast";
import type { appleOAuth2CodeResponse } from "@/types/auth";
import { AUTH_REDIRECT_PARAM, getSafeCommunityRedirectPath } from "./authRedirect";

export const authProviderName = (provider: "KAKAO" | "APPLE" | "EMAIL"): string => {
  if (provider === "KAKAO") {
    return "카카오";
  } else if (provider === "APPLE") {
    return "애플";
  } else if (provider === "EMAIL") {
    return "이메일";
  } else {
    return "";
  }
};

export const kakaoLogin = (redirectPath?: string) => {
  if (window.Kakao?.Auth) {
    const safeRedirectPath = getSafeCommunityRedirectPath(redirectPath);

    window.Kakao.Auth.authorize({
      redirectUri: `${process.env.NEXT_PUBLIC_WEB_URL}/login/kakao/callback`,
      ...(safeRedirectPath ? { state: safeRedirectPath } : {}),
    });
  } else {
    showIconToast("logo", "Kakao SDK를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
  }
};

export const appleLogin = async (redirectPath?: string) => {
  if (!window.AppleID || !window.AppleID.auth) {
    showIconToast("logo", "Apple SDK를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
    return;
  }

  const safeRedirectPath = getSafeCommunityRedirectPath(redirectPath);

  window.AppleID.auth.init({
    clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID,
    scope: process.env.NEXT_PUBLIC_APPLE_SCOPE,
    redirectURI: `${process.env.NEXT_PUBLIC_WEB_URL}/login/apple/callback`,
    usePopup: true,
  });

  try {
    const res = (await window.AppleID.auth.signIn()) as appleOAuth2CodeResponse;
    if (res.authorization) {
      const params = new URLSearchParams({ code: res.authorization.code });

      if (safeRedirectPath) {
        params.set(AUTH_REDIRECT_PARAM, safeRedirectPath);
      }

      window.location.href = `/login/apple/callback?${params.toString()}`;
    }
  } catch (error) {
    // Log error for developers

    // Check if user cancelled the login
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes("popup_closed_by_user") || errorMessage.includes("user_cancelled_authorize")) {
      // User intentionally cancelled - no need to show error
      return;
    }

    // Show user-facing error message for other failures
    showIconToast("logo", "Apple 로그인에 실패했습니다. 잠시 후 다시 시도해주세요.");

    // Propagate error for upstream handling if needed
    throw error;
  }
};
