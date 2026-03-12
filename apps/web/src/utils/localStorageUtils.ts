/**
 * @deprecated 이 함수들은 더 이상 사용되지 않습니다.
 * 대신 useAuthStore의 setAccessToken, clearAccessToken을 사용하세요.
 * Zustand persist가 자동으로 localStorage를 관리합니다.
 *
 * @example
 * // ❌ 사용하지 마세요:
 * import { saveAccessTokenToLS } from "@/utils/localStorageUtils";
 * saveAccessTokenToLS(token);
 *
 * // ✅ 대신 이렇게 사용하세요:
 * import useAuthStore from "@/lib/zustand/useAuthStore";
 * const { setAccessToken } = useAuthStore();
 * setAccessToken(token);
 */

/**
 * @deprecated useAuthStore의 setAccessToken을 사용하세요
 */
export const saveAccessTokenToLS = (token: string) => {
  console.warn(
    "[DEPRECATED] saveAccessTokenToLS는 더 이상 사용되지 않습니다. useAuthStore의 setAccessToken을 사용하세요.",
  );
  localStorage.setItem("accessToken", token);
};

/**
 * @deprecated useAuthStore의 clearAccessToken을 사용하세요
 */
export const removeAccessTokenToLS = () => {
  console.warn(
    "[DEPRECATED] removeAccessTokenToLS는 더 이상 사용되지 않습니다. useAuthStore의 clearAccessToken을 사용하세요.",
  );
  localStorage.removeItem("accessToken");
};

/**
 * @deprecated useAuthStore의 accessToken 상태를 직접 읽으세요
 */
export const getAccessTokenFromLS = (): string | null => {
  console.warn(
    "[DEPRECATED] getAccessTokenFromLS는 더 이상 사용되지 않습니다. useAuthStore의 accessToken 상태를 사용하세요.",
  );
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
};
