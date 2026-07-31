import axios, { type AxiosResponse } from "axios";
import { createMissingAdminApiServerUrlError, getAdminApiServerUrl } from "@/lib/env";
import { loadAccessToken } from "@/lib/utils/localStorage";
import type { AdminSignInResponse, ReissueAccessTokenResponse } from "@/types/auth";

const API_SERVER_URL = getAdminApiServerUrl();

const authAxiosInstance = axios.create({
	baseURL: API_SERVER_URL || undefined,
	withCredentials: true,
});

const ADMIN_AUTH_PATH = "/admin/auth";

const assertAdminApiServerUrl = () => {
	if (!API_SERVER_URL) {
		throw createMissingAdminApiServerUrlError();
	}
};

export const adminSignInApi = (email: string, password: string): Promise<AxiosResponse<AdminSignInResponse>> => {
	assertAdminApiServerUrl();
	return authAxiosInstance.post(`${ADMIN_AUTH_PATH}/sign-in`, { email, password });
};

export const reissueAccessTokenApi = (): Promise<AxiosResponse<ReissueAccessTokenResponse>> => {
	assertAdminApiServerUrl();
	return authAxiosInstance.post(`${ADMIN_AUTH_PATH}/reissue`);
};

export const adminSignOutApi = (): Promise<AxiosResponse<void>> => {
	assertAdminApiServerUrl();

	const accessToken = loadAccessToken();

	return authAxiosInstance.post(`${ADMIN_AUTH_PATH}/sign-out`, undefined, {
		headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
	});
};
