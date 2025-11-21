import { appleOAuth2CodeResponse } from "@/types/auth";

import { toast } from "@/lib/zustand/useToastStore";

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

export const kakaoLogin = () => {
  if (window.Kakao && window.Kakao.Auth) {
    // 현재 URL에서 redirect 파라미터 추출
    const urlParams = new URLSearchParams(window.location.search);
    const redirectParam = urlParams.get("redirect");

    // redirect 파라미터가 있으면 callback URL에 전달
    let redirectUri = `${process.env.NEXT_PUBLIC_WEB_URL}/login/kakao/callback`;
    if (redirectParam) {
      redirectUri += `?redirect=${encodeURIComponent(redirectParam)}`;
    }

    window.Kakao.Auth.authorize({
      redirectUri,
    });
  } else {
    toast.error("Kakao SDK를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
  }
};

export const appleLogin = async () => {
  if (!window.AppleID || !window.AppleID.auth) {
    toast.error("Apple SDK를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
    return;
  }

  // 현재 URL에서 redirect 파라미터 추출
  const urlParams = new URLSearchParams(window.location.search);
  const redirectParam = urlParams.get("redirect");

  // redirect 파라미터가 있으면 callback URL에 전달
  let redirectURI = `${process.env.NEXT_PUBLIC_WEB_URL}/login/apple/callback`;
  if (redirectParam) {
    redirectURI += `?redirect=${encodeURIComponent(redirectParam)}`;
  }

  window.AppleID.auth.init({
    clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID,
    scope: process.env.NEXT_PUBLIC_APPLE_SCOPE,
    redirectURI,
    usePopup: true,
  });

  try {
    const res: appleOAuth2CodeResponse = await window.AppleID.auth.signIn();
    if (res.authorization) {
      // redirect 파라미터가 있으면 callback URL에 전달
      let callbackUrl = `/login/apple/callback?code=${encodeURIComponent(res.authorization.code)}`;
      if (redirectParam) {
        callbackUrl += `&redirect=${encodeURIComponent(redirectParam)}`;
      }
      window.location.href = callbackUrl;
    }
  } catch (error) {
    // Log error for developers
    console.error("Apple 로그인 실패:", error);

    // Check if user cancelled the login
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes("popup_closed_by_user") || errorMessage.includes("user_cancelled_authorize")) {
      // User intentionally cancelled - no need to show error
      console.log("Apple 로그인이 사용자에 의해 취소되었습니다.");
      return;
    }

    // Show user-facing error message for other failures
    toast.error("Apple 로그인에 실패했습니다. 잠시 후 다시 시도해주세요.");

    // Propagate error for upstream handling if needed
    throw error;
  }
};
