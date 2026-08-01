import type { AdminApiEnvironment } from "@/lib/auth/environment";

const ADMIN_ACCESS_TOKEN_KEY = "adminAccessToken";
const ADMIN_API_ENVIRONMENT_KEY = "adminApiEnvironment";

export const loadAccessToken = () => {
	try {
		return localStorage.getItem(ADMIN_ACCESS_TOKEN_KEY);
	} catch (err) {
		console.error("Could not load access token", err);
		return null;
	}
};

export const saveAccessToken = (token: string) => {
	try {
		localStorage.setItem(ADMIN_ACCESS_TOKEN_KEY, token);
	} catch (err) {
		console.error("Could not save access token", err);
	}
};

export const removeAccessToken = () => {
	try {
		localStorage.removeItem(ADMIN_ACCESS_TOKEN_KEY);
	} catch (err) {
		console.error("Could not remove access token", err);
	}
};

export const loadAdminApiEnvironment = (): AdminApiEnvironment | null => {
	if (typeof window === "undefined") {
		return null;
	}

	try {
		const value = localStorage.getItem(ADMIN_API_ENVIRONMENT_KEY);
		// 레거시 값("dev")으로 저장된 기존 사용자의 선택을 보존하기 위해 stage로 해석한다.
		if (value === "dev") {
			return "stage";
		}
		return value === "stage" || value === "prod" ? value : null;
	} catch (err) {
		console.error("Could not load admin api environment", err);
		return null;
	}
};

export const saveAdminApiEnvironment = (environment: AdminApiEnvironment) => {
	try {
		localStorage.setItem(ADMIN_API_ENVIRONMENT_KEY, environment);
	} catch (err) {
		console.error("Could not save admin api environment", err);
	}
};

export const removeAdminApiEnvironment = () => {
	try {
		localStorage.removeItem(ADMIN_API_ENVIRONMENT_KEY);
	} catch (err) {
		console.error("Could not remove admin api environment", err);
	}
};
