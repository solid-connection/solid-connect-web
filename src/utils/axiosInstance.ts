import axios, { AxiosError, AxiosHeaders, AxiosInstance } from "axios";

import { isTokenExpired } from "./jwtUtils";

import { clearAccessToken, getAccessToken, setAccessToken } from "@/stores/tokenStore";

const redirectToLogin = () => {
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

const convertToBearer = (token: string) => `Bearer ${token}`;

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_SERVER_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const newConfig = { ...config };
    let accessToken: string | null = getAccessToken();
    console.log("accessToken", accessToken);

    if (accessToken === null || isTokenExpired(accessToken)) {
      // HTTP-only 쿠키로 토큰 갱신 시도
      try {
        const newToken = await reissueAccessToken();
        if (newToken) {
          accessToken = newToken;
          setAccessToken(accessToken);
        } else {
          clearAccessToken();
          return config;
        }
      } catch (err) {
        clearAccessToken();
        console.error("인증 토큰 갱신중 오류가 발생했습니다", err);
        redirectToLogin();
        return config;
      }
    }

    if (accessToken !== null) {
      newConfig.headers.Authorization = convertToBearer(accessToken);
    }
    return newConfig;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const newError = { ...error };
    if (error.response?.status === 401 || error.response?.status === 403) {
      // HTTP-only 쿠키로 토큰 갱신 시도
      try {
        const newAccessToken = await reissueAccessToken();
        if (newAccessToken) {
          setAccessToken(newAccessToken);

          // Safely check if error.config exists and initialize headers if missing
          if (error.config) {
            if (!error.config.headers) {
              error.config.headers = new AxiosHeaders();
            }
            error.config.headers.Authorization = convertToBearer(newAccessToken);

            // 중단된 요청 새로운 토큰으로 재전송
            return await axios.request(error.config);
          }
        } else {
          clearAccessToken();
          redirectToLogin();
          throw Error("로그인이 필요합니다");
        }
        // eslint-disable-next-line
      } catch (err) {
        clearAccessToken();
        redirectToLogin();
        throw Error("로그인이 필요합니다");
      }
    } else {
      throw newError;
    }
  },
);

export const publicAxiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_SERVER_URL,
  withCredentials: true, // HTTP-only 쿠키 포함
});

// 토큰 갱신 함수 (HTTP-only 쿠키 기반)
const reissueAccessToken = async (): Promise<string | null> => {
  try {
    const response = await publicAxiosInstance.post<{ accessToken: string }>("/auth/reissue");
    return response.data.accessToken;
  } catch (error) {
    console.error("토큰 갱신 실패:", error);
    return null;
  }
};
