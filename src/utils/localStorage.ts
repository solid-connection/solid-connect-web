// 리프레시 토큰은 HTTP-only 쿠키로 관리되므로 이 파일에서는 제거됨
// 액세스 토큰은 Zustand 스토어로 관리
import { clearAccessToken, getAccessToken, setAccessToken } from "@/lib/zustand/useTokenStore";

// 기존 코드와의 호환성을 위한 래퍼 함수들
export const loadAccessToken = () => {
  return getAccessToken();
};

export const saveAccessToken = (token: string) => {
  setAccessToken(token);
};

export const removeAccessToken = () => {
  clearAccessToken();
};

// 리프레시 토큰 관련 함수들은 더 이상 사용하지 않음
// (HTTP-only 쿠키로 서버에서 관리)
export const loadRefreshToken = () => {
  console.warn("리프레시 토큰은 HTTP-only 쿠키로 관리됩니다.");
  return null;
};

export const saveRefreshToken = (token: string) => {
  console.warn("리프레시 토큰은 HTTP-only 쿠키로 관리됩니다. 저장이 무시됩니다.");
};

export const removeRefreshToken = () => {
  console.warn("리프레시 토큰은 HTTP-only 쿠키로 관리됩니다. 제거가 무시됩니다.");
};
