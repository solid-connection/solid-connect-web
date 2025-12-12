import { appleOAuth2CodeResponse } from "@/types/auth";

import { toast } from "@/lib/zustand/useToastStore";

// 오픈 리다이렉트 공격 방지를 위한 redirect 파라미터 검증
// 단일 "/"로 시작하고 "//"나 "://"를 포함하지 않는 내부 경로만 허용
export const validateSafeRedirect = (redirectParam: string | null): string => {
  if (!redirectParam || typeof redirectParam !== "string") {
    return "/";
  }

  if (redirectParam.startsWith("/") && !redirectParam.startsWith("//") && !redirectParam.includes("://")) {
    return redirectParam;
  }

  return "/";
};

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
    // 현재 URL에서 redirect 파라미터 추출 및 검증
    const urlParams = new URLSearchParams(window.location.search);
    const redirectParam = urlParams.get("redirect");
    const safeRedirect = validateSafeRedirect(redirectParam);

    // 검증된 redirect 파라미터를 callback URL에 전달
    let redirectUri = `${process.env.NEXT_PUBLIC_WEB_URL}/login/kakao/callback`;
    // 기본값 "/"가 아닌 경우에만 redirect 파라미터 추가 (기본값이면 생략 가능)
    if (safeRedirect !== "/") {
      redirectUri += `?redirect=${encodeURIComponent(safeRedirect)}`;
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

  // 현재 URL에서 redirect 파라미터 추출 및 검증
  const urlParams = new URLSearchParams(window.location.search);
  const redirectParam = urlParams.get("redirect");
  const safeRedirect = validateSafeRedirect(redirectParam);

  // 검증된 redirect 파라미터를 callback URL에 전달
  let redirectURI = `${process.env.NEXT_PUBLIC_WEB_URL}/login/apple/callback`;
  // 기본값 "/"가 아닌 경우에만 redirect 파라미터 추가 (기본값이면 생략 가능)
  if (safeRedirect !== "/") {
    redirectURI += `?redirect=${encodeURIComponent(safeRedirect)}`;
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
      // 검증된 redirect 파라미터를 callback URL에 전달
      let callbackUrl = `/login/apple/callback?code=${encodeURIComponent(res.authorization.code)}`;
      if (safeRedirect !== "/") {
        callbackUrl += `&redirect=${encodeURIComponent(safeRedirect)}`;
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
