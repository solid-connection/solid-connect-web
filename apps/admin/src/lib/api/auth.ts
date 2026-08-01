import axios, { type AxiosResponse } from "axios";
import { getApiBaseUrlForEnvironment, resolveEnvironmentFromEmail } from "@/lib/auth/environment";
import { resolveActiveApiBaseUrl } from "@/lib/env";
import { loadAccessToken, removeAccessToken, saveAdminApiEnvironment } from "@/lib/utils/localStorage";
import type { AdminSignInResponse, ReissueAccessTokenResponse } from "@/types/auth";

const authAxiosInstance = axios.create({
	withCredentials: true,
});

authAxiosInstance.interceptors.request.use((config) => {
	const newConfig = { ...config };
	// Respect an explicitly-provided baseURL (e.g. adminSignInApi pinning the just-resolved
	// environment) instead of always re-deriving it from potentially-unavailable storage.
	newConfig.baseURL = config.baseURL ?? resolveActiveApiBaseUrl();
	return newConfig;
});

export const adminSignInApi = (email: string, password: string): Promise<AxiosResponse<AdminSignInResponse>> => {
	const environment = resolveEnvironmentFromEmail(email);

	// Clear any previous environment's token before switching, so a stale token can never
	// ride along to the newly resolved environment's API (e.g. dev token leaking to prod).
	removeAccessToken();
	saveAdminApiEnvironment(environment);

	// Pin this request's baseURL directly instead of relying on a localStorage round trip:
	// if storage is unavailable, the request still goes to the correctly resolved environment.
	return authAxiosInstance.post(
		"/auth/email/sign-in",
		{ email, password },
		{ baseURL: getApiBaseUrlForEnvironment(environment) },
	);
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
