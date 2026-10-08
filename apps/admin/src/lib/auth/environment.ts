export type AdminApiEnvironment = "stage" | "prod";

const API_BASE_URLS: Record<AdminApiEnvironment, string> = {
	stage: "https://api.stage.solid-connection.com",
	prod: "https://api.solid-connection.com",
};

export const getApiBaseUrlForEnvironment = (environment: AdminApiEnvironment): string => API_BASE_URLS[environment];
