import axios, { AxiosInstance } from "axios";

import { isTokenExpired } from "./jwtUtils";
import {
  loadAccessToken,
  loadRefreshToken,
  removeAccessToken,
  removeRefreshToken,
  saveAccessToken,
} from "./localStorage";

// eslint-disable-next-line import/no-cycle
import { reissueAccessTokenPublicApi } from "@/apis/auth";

const convertToBearer = (token: string) => `Bearer ${token}`;

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_SERVER_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const newConfig = { ...config };
    let accessToken: string | null = loadAccessToken();
    if (accessToken === null || isTokenExpired(accessToken)) {
      const refreshToken = loadRefreshToken();
      if (refreshToken === null || isTokenExpired(refreshToken)) {
        removeAccessToken();
        removeRefreshToken();
        return config;
      }
      await reissueAccessTokenPublicApi(refreshToken)
        .then((res) => {
          accessToken = res.data.accessToken;
          saveAccessToken(accessToken);
        })
        .catch((err) => {
          removeAccessToken();
          removeRefreshToken();
          console.error("인증 토큰 갱신중 오류가 발생했습니다", err);
        });
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
  async (error) => {
    const newError = { ...error };
    if (error.response?.status === 401 || error.response?.status === 403) {
      const refreshToken = loadRefreshToken();

      if (refreshToken === null || isTokenExpired(refreshToken)) {
        removeAccessToken();
        removeRefreshToken();
        throw newError;
      }

      try {
        const newAccessToken = await reissueAccessTokenPublicApi(refreshToken).then((res) => res.data.accessToken);
        saveAccessToken(newAccessToken);

        if (error?.config.headers === undefined) {
          newError.config.headers = {};
        }
        newError.config.headers.Authorization = convertToBearer(newAccessToken);

        // 중단된 요청 새로운 토큰으로 재전송
        return await axios.request(newError.config);
        // eslint-disable-next-line
      } catch (err) {
        removeAccessToken();
        removeRefreshToken();
        throw Error("로그인이 필요합니다");
      }
    } else {
      throw newError;
    }
  },
);

export const publicAxiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_SERVER_URL,
});
