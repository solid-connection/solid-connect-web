export type AdminApiEnvironment = "dev" | "prod";

const DEV_ACCOUNT_EMAIL = "dev@solid-connection.com";

const API_BASE_URLS: Record<AdminApiEnvironment, string> = {
	dev: "https://api.stage.solid-connection.com",
	prod: "https://api.solid-connection.com",
};

export const resolveEnvironmentFromEmail = (email: string): AdminApiEnvironment => {
	const normalizedEmail = email.trim().toLowerCase();
	return normalizedEmail === DEV_ACCOUNT_EMAIL ? "dev" : "prod";
};

export const getApiBaseUrlForEnvironment = (environment: AdminApiEnvironment): string => API_BASE_URLS[environment];
