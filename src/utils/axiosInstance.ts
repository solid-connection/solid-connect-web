import axios, { AxiosInstance } from "axios";

import { reissueAccessTokenPublicApi } from "@/services/auth";

import { isTokenExpired } from "./jwtUtils";
import {
  loadAccessToken,
  loadRefreshToken,
  removeAccessToken,
  removeRefreshToken,
  saveAccessToken,
} from "./localStorage";

const convertToBearer = (token: string) => {
  return `Bearer ${token}`;
};

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_SERVER_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    let accessToken: string | null = loadAccessToken();
    if (accessToken === null || isTokenExpired(accessToken)) {
      const refreshToken = loadRefreshToken();
      if (refreshToken === null || isTokenExpired(refreshToken)) {
        removeAccessToken();
        removeRefreshToken();
        return config;
      }
      accessToken = await reissueAccessTokenPublicApi(refreshToken)
        .then((res) => {
          return res.data.accessToken;
        })
        .catch((err) => {
          document.location.href = "/login";
          return null;
        });
      saveAccessToken(accessToken);
    }
    config.headers["Authorization"] = convertToBearer(accessToken);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      const refreshToken = loadRefreshToken();

      if (refreshToken === null || isTokenExpired(refreshToken)) {
        removeAccessToken();
        removeRefreshToken();
        throw Error("로그인이 필요합니다");
        // document.location.href = "/login"; // 로그인 페이지로 이동
        return Promise.reject(error);
      }

      try {
        const newAccessToken = await reissueAccessTokenPublicApi(refreshToken).then((res) => {
          return res.data.accessToken;
        });
        saveAccessToken(newAccessToken);

        if (error?.config.headers === undefined) {
          error.config.headers = {};
        }
        error.config.headers["Authorization"] = convertToBearer(newAccessToken);

        // 중단된 요청 새로운 토큰으로 재전송
        return await axios.request(error.config);
      } catch (err) {
        document.location.href = "/login"; // 로그인 페이지로 이동
      }
    } else {
      throw error;
    }
  },
);

export const publicAxiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_SERVER_URL,
});
