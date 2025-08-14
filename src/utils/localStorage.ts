// 환경 변수에 따른 토큰 관리 방식 분기
import {
  loadAccessTokenFromLS,
  loadRefreshTokenFromLS,
  removeAccessTokenFromLS,
  removeRefreshTokenFromLS,
  saveAccessTokenToLS,
} from "./localStorageUtils";

import { clearAccessToken, getAccessToken, setAccessToken } from "@/lib/zustand/useTokenStore";

// 쿠키 로그인 활성화 여부 확인
export const isCookieLoginEnabled = () => {
  return process.env.NEXT_PUBLIC_COOKIE_LOGIN_ENABLED === "true";
};

// 기존 코드와의 호환성을 위한 래퍼 함수들
export const loadAccessToken = (): string | null => {
  if (isCookieLoginEnabled()) {
    // 쿠키 모드: Zustand 스토어에서 가져오기
    return getAccessToken();
  } else {
    // 로컬스토리지 모드: 로컬스토리지에서 가져오기
    return loadAccessTokenFromLS();
  }
};

export const saveAccessToken = (token: string) => {
  if (isCookieLoginEnabled()) {
    // 쿠키 모드: Zustand 스토어만 사용
    setAccessToken(token);
  } else {
    // 로컬스토리지 모드: 로컬스토리지와 Zustand 스토어 모두 사용
    saveAccessTokenToLS(token);
    setAccessToken(token);
  }
};

export const removeAccessToken = () => {
  if (isCookieLoginEnabled()) {
    // 쿠키 모드: Zustand 스토어만 정리
    clearAccessToken();
  } else {
    // 로컬스토리지 모드: 로컬스토리지와 Zustand 스토어 모두 정리
    removeAccessTokenFromLS();
    clearAccessToken();
  }
};

// 리프레시 토큰 관련 함수들
export const loadRefreshToken = () => {
  if (isCookieLoginEnabled()) {
    console.warn("쿠키 모드에서는 리프레시 토큰이 HTTP-only 쿠키로 관리됩니다.");
    return null;
  } else {
    return loadRefreshTokenFromLS();
  }
};

export const saveRefreshToken = (token: string) => {
  if (isCookieLoginEnabled()) {
    console.warn("쿠키 모드에서는 리프레시 토큰이 HTTP-only 쿠키로 관리됩니다. 저장이 무시됩니다.");
  } else {
    // 로컬스토리지 모드에서만 저장
    // 이 함수는 usePostEmailAuth 등에서 직접 호출되므로 여기서는 로그만 출력
    console.warn("saveRefreshToken은 더 이상 사용하지 않습니다. saveRefreshTokenToLS를 직접 사용하세요.");
  }
};

export const removeRefreshToken = () => {
  if (isCookieLoginEnabled()) {
    console.warn("쿠키 모드에서는 리프레시 토큰이 HTTP-only 쿠키로 관리됩니다. 제거가 무시됩니다.");
  } else {
    removeRefreshTokenFromLS();
  }
};
