const getTrimmedEnv = (key: string) => import.meta.env[key]?.trim() ?? "";

export const getAdminApiServerUrl = () => getTrimmedEnv("VITE_API_SERVER_URL");

export const createMissingAdminApiServerUrlError = () =>
	new Error("[admin] VITE_API_SERVER_URL is required. Configure it in your environment.");
