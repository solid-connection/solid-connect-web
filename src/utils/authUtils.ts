import { isTokenExpired } from "./jwtUtils";

import { appleOAuth2CodeResponse } from "@/types/auth";

import useAuthStore from "@/lib/zustand/useAuthStore";

export const isAuthenticated = () => {
  const accessToken = useAuthStore.getState().accessToken;

  if (accessToken && !isTokenExpired(accessToken)) {
    return true;
  }

  return false;
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
    window.Kakao.Auth.authorize({
      redirectUri: `${process.env.NEXT_PUBLIC_WEB_URL}/login/kakao/callback`,
    });
  } else {
    alert("Kakao SDK를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
  }
};

export const appleLogin = async () => {
  if (!window.AppleID || !window.AppleID.auth) {
    alert("Apple SDK를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
    return;
  }

  window.AppleID.auth.init({
    clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID,
    scope: process.env.NEXT_PUBLIC_APPLE_SCOPE,
    redirectURI: `${process.env.NEXT_PUBLIC_WEB_URL}/login/apple/callback`,
    usePopup: true,
  });

  try {
    const res: appleOAuth2CodeResponse = await window.AppleID.auth.signIn();
    if (res.authorization) {
      window.location.href = `/login/apple/callback?code=${encodeURIComponent(res.authorization.code)}`;
    }
  } catch (error) {
    console.log(error);
  }
};

export const isCookieLoginEnabled = (): boolean => {
  return process.env.NEXT_PUBLIC_COOKIE_LOGIN_ENABLED === "true";
};
