import axios, { type AxiosResponse } from "axios";
import { resolveActiveApiBaseUrl } from "@/lib/env";
import { loadAccessToken, removeAccessToken } from "@/lib/utils/localStorage";
import type { AdminSignInResponse, ReissueAccessTokenResponse } from "@/types/auth";

const authAxiosInstance = axios.create({
	withCredentials: true,
});

const ADMIN_AUTH_PATH = "/admin/auth";

authAxiosInstance.interceptors.request.use((config) => {
	const newConfig = { ...config };
	newConfig.baseURL = config.baseURL ?? resolveActiveApiBaseUrl();
	return newConfig;
});

export const adminSignInApi = (email: string, password: string): Promise<AxiosResponse<AdminSignInResponse>> => {
	removeAccessToken();

	return authAxiosInstance.post(`${ADMIN_AUTH_PATH}/sign-in`, { email, password });
};

export const reissueAccessTokenApi = (): Promise<AxiosResponse<ReissueAccessTokenResponse>> => {
	return authAxiosInstance.post(`${ADMIN_AUTH_PATH}/reissue`);
};

export const adminSignOutApi = (): Promise<AxiosResponse<void>> => {
	const accessToken = loadAccessToken();

	return authAxiosInstance.post(`${ADMIN_AUTH_PATH}/sign-out`, undefined, {
		headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
	});
};
