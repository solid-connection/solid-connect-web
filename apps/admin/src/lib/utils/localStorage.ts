import type { AdminApiEnvironment } from "@/lib/auth/environment";

const ADMIN_API_ENVIRONMENT_KEY = "adminApiEnvironment";

export const loadAccessToken = () => {
	try {
		return localStorage.getItem("accessToken");
	} catch (err) {
		console.error("Could not load access token", err);
		return null;
	}
};

export const saveAccessToken = (token: string) => {
	try {
		localStorage.setItem("accessToken", token);
	} catch (err) {
		console.error("Could not save access token", err);
	}
};

export const removeAccessToken = () => {
	try {
		localStorage.removeItem("accessToken");
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
		return value === "dev" || value === "prod" ? value : null;
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
