export type AdminApiEnvironment = "dev" | "prod";

const DEV_EMAIL_DOMAIN = "dev.solid-connection.com";

const API_BASE_URLS: Record<AdminApiEnvironment, string> = {
	dev: "https://api.stage.solid-connection.com",
	prod: "https://api.solid-connection.com",
};

export const resolveEnvironmentFromEmail = (email: string): AdminApiEnvironment => {
	const normalizedEmail = email.trim().toLowerCase();
	return normalizedEmail.endsWith(`@${DEV_EMAIL_DOMAIN}`) ? "dev" : "prod";
};

export const getApiBaseUrlForEnvironment = (environment: AdminApiEnvironment): string => API_BASE_URLS[environment];
