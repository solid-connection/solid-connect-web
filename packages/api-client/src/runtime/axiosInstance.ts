import axios, { type AxiosError, AxiosHeaders, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";

export interface TokenStorageAdapter {
  loadAccessToken: () => string | null;
  loadRefreshToken: () => string | null;
  saveAccessToken: (token: string) => void;
  removeAccessToken: () => void;
  removeRefreshToken: () => void;
}

export interface RuntimeConfig {
  baseURL: string;
  tokenStorage: TokenStorageAdapter;
  isTokenExpired: (token: string) => boolean;
  reissueAccessToken: (refreshToken: string) => Promise<string>;
}

export const convertToBearer = (token: string) => `Bearer ${token}`;

export const axiosInstance: AxiosInstance = axios.create({
  withCredentials: true,
});

export const publicAxiosInstance: AxiosInstance = axios.create({
  withCredentials: true,
});

let runtimeConfig: RuntimeConfig | null = null;
let interceptorsBound = false;

const attachAuthorization = (config: InternalAxiosRequestConfig, token: string) => {
  if (!config.headers) {
    config.headers = AxiosHeaders.from({});
  }
  config.headers.Authorization = convertToBearer(token);
};

const clearTokens = (storage: TokenStorageAdapter) => {
  storage.removeAccessToken();
  storage.removeRefreshToken();
};

const bindInterceptors = () => {
  if (interceptorsBound) {
    return;
  }

  axiosInstance.interceptors.request.use(
    async (config) => {
      if (!runtimeConfig) {
        return config;
      }

      const { tokenStorage, isTokenExpired, reissueAccessToken } = runtimeConfig;
      let accessToken = tokenStorage.loadAccessToken();

      if (accessToken === null || isTokenExpired(accessToken)) {
        const refreshToken = tokenStorage.loadRefreshToken();
        if (refreshToken === null || isTokenExpired(refreshToken)) {
          clearTokens(tokenStorage);
          return config;
        }

        try {
          accessToken = await reissueAccessToken(refreshToken);
          tokenStorage.saveAccessToken(accessToken);
        } catch {
          clearTokens(tokenStorage);
          return config;
        }
      }

      if (accessToken !== null) {
        attachAuthorization(config, accessToken);
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (!runtimeConfig) {
        throw error;
      }

      const status = error.response?.status;
      if (status !== 401 && status !== 403) {
        throw error;
      }

      const originalConfig = error.config;
      if (!originalConfig) {
        throw error;
      }

      const { tokenStorage, isTokenExpired, reissueAccessToken } = runtimeConfig;
      const refreshToken = tokenStorage.loadRefreshToken();
      if (refreshToken === null || isTokenExpired(refreshToken)) {
        clearTokens(tokenStorage);
        throw error;
      }

      try {
        const newAccessToken = await reissueAccessToken(refreshToken);
        tokenStorage.saveAccessToken(newAccessToken);
        attachAuthorization(originalConfig, newAccessToken);
        return await axios.request(originalConfig);
      } catch {
        clearTokens(tokenStorage);
        throw new Error("로그인이 필요합니다");
      }
    },
  );

  interceptorsBound = true;
};

export const configureApiClientRuntime = (config: RuntimeConfig) => {
  runtimeConfig = config;
  axiosInstance.defaults.baseURL = config.baseURL;
  publicAxiosInstance.defaults.baseURL = config.baseURL;
  bindInterceptors();
};
