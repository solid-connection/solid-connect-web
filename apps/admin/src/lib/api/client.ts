import { reissueAccessTokenApi } from "@/lib/api/auth";
import {
	axiosInstance,
	configureApiClientRuntime,
	publicAxiosInstance,
	type TokenStorageAdapter,
} from "@solid-connect/api-client/runtime";
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

configureApiClientRuntime({
	baseURL: import.meta.env.VITE_API_SERVER_URL,
	tokenStorage,
	isTokenExpired,
	reissueAccessToken: async (refreshToken: string) => {
		const response = await reissueAccessTokenApi(refreshToken);
		return response.data.accessToken;
	},
});

export { axiosInstance, publicAxiosInstance };
