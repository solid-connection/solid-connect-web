import axios, { type AxiosResponse } from "axios";
import { resolveEnvironmentFromEmail } from "@/lib/auth/environment";
import { resolveActiveApiBaseUrl } from "@/lib/env";
import { loadAccessToken, removeAccessToken, saveAdminApiEnvironment } from "@/lib/utils/localStorage";
import type { AdminSignInResponse, ReissueAccessTokenResponse } from "@/types/auth";

const authAxiosInstance = axios.create({
	baseURL: resolveActiveApiBaseUrl(),
	withCredentials: true,
});

authAxiosInstance.interceptors.request.use((config) => {
	const newConfig = { ...config };
	newConfig.baseURL = resolveActiveApiBaseUrl();
	return newConfig;
});

export const adminSignInApi = (email: string, password: string): Promise<AxiosResponse<AdminSignInResponse>> => {
	// Clear any previous environment's token before switching, so a stale token can never
	// ride along to the newly resolved environment's API (e.g. dev token leaking to prod).
	removeAccessToken();
	saveAdminApiEnvironment(resolveEnvironmentFromEmail(email));
	return authAxiosInstance.post("/auth/email/sign-in", { email, password });
};

export const reissueAccessTokenApi = (): Promise<AxiosResponse<ReissueAccessTokenResponse>> => {
	return authAxiosInstance.post("/auth/reissue");
};

export const adminSignOutApi = (): Promise<AxiosResponse<void>> => {
	const accessToken = loadAccessToken();

	return authAxiosInstance.post("/auth/sign-out", undefined, {
		headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
	});
};
