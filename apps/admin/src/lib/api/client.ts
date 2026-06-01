import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import { clearSession, ensureSessionToken, reissueAccessTokenIfPossible } from "@/lib/auth/session";
import { createMissingAdminApiServerUrlError, getAdminApiServerUrl } from "@/lib/env";

const convertToBearer = (token: string) => `Bearer ${token}`;

const API_SERVER_URL = getAdminApiServerUrl();

export const axiosInstance: AxiosInstance = axios.create({
	baseURL: API_SERVER_URL || undefined,
	withCredentials: true,
});

const redirectToLogin = () => {
	if (typeof window !== "undefined" && window.location.pathname !== "/auth/login") {
		window.location.replace("/auth/login");
	}
};

axiosInstance.interceptors.request.use(
	async (config) => {
		if (!API_SERVER_URL) {
			return Promise.reject(createMissingAdminApiServerUrlError());
		}

		const newConfig = { ...config };
		const accessToken = await ensureSessionToken();

		if (!accessToken) {
			clearSession();
			redirectToLogin();
			return Promise.reject(new Error("로그인이 필요합니다."));
		}

		newConfig.headers.Authorization = convertToBearer(accessToken);
		return newConfig;
	},
	(error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const status = error.response?.status;
		const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

		if ((status === 401 || status === 403) && originalRequest && !originalRequest._retry) {
			originalRequest._retry = true;

			const reissuedAccessToken = await reissueAccessTokenIfPossible();
			if (reissuedAccessToken) {
				originalRequest.headers = originalRequest.headers ?? {};
				originalRequest.headers.Authorization = convertToBearer(reissuedAccessToken);
				return axiosInstance(originalRequest);
			}
		}

		if (status === 401 || status === 403) {
			clearSession();
			redirectToLogin();
		}

		return Promise.reject(error);
	},
);
