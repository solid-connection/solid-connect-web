import {
	axiosInstance,
	configureApiClientRuntime,
	publicAxiosInstance,
	type TokenStorageAdapter,
} from "@solid-connect/api-client/runtime";
import { reissueAccessTokenApi } from "@/lib/api/auth";
import { isTokenExpired } from "@/lib/utils/jwtUtils";
import {
	loadAccessToken,
	loadRefreshToken,
	removeAccessToken,
	removeRefreshToken,
	saveAccessToken,
} from "@/lib/utils/localStorage";

const tokenStorage: TokenStorageAdapter = {
	loadAccessToken,
	loadRefreshToken,
	saveAccessToken,
	removeAccessToken,
	removeRefreshToken,
};

const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL?.trim();

if (!API_SERVER_URL) {
	throw new Error("[admin] VITE_API_SERVER_URL is required. Configure it in your environment.");
}

configureApiClientRuntime({
	baseURL: API_SERVER_URL,
	tokenStorage,
	isTokenExpired,
	reissueAccessToken: async (refreshToken: string) => {
		const response = await reissueAccessTokenApi(refreshToken);
		return response.data.accessToken;
	},
});

export { axiosInstance, publicAxiosInstance };
