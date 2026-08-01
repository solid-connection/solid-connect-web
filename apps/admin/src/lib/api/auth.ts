import axios, { type AxiosResponse } from "axios";
import { getApiBaseUrlForEnvironment, resolveEnvironmentFromEmail } from "@/lib/auth/environment";
import { resolveActiveApiBaseUrl } from "@/lib/env";
import { loadAccessToken, removeAccessToken, saveAdminApiEnvironment } from "@/lib/utils/localStorage";
import type { AdminSignInResponse, ReissueAccessTokenResponse } from "@/types/auth";

const authAxiosInstance = axios.create({
	withCredentials: true,
});

const ADMIN_AUTH_PATH = "/admin/auth";

authAxiosInstance.interceptors.request.use((config) => {
	const newConfig = { ...config };
	// 로그인에서 직접 지정한 baseURL을 우선하고, 나머지 요청은 저장된 어드민 환경을 사용한다.
	newConfig.baseURL = config.baseURL ?? resolveActiveApiBaseUrl();
	return newConfig;
});

export const adminSignInApi = (email: string, password: string): Promise<AxiosResponse<AdminSignInResponse>> => {
	const environment = resolveEnvironmentFromEmail(email);

	removeAccessToken();
	saveAdminApiEnvironment(environment);

	return authAxiosInstance.post(
		`${ADMIN_AUTH_PATH}/sign-in`,
		{ email, password },
		{ baseURL: getApiBaseUrlForEnvironment(environment) },
	);
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
