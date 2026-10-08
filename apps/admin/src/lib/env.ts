import { getApiBaseUrlForEnvironment } from "@/lib/auth/environment";
import { loadAdminApiEnvironment } from "@/lib/utils/localStorage";

const getTrimmedEnv = (key: string) => import.meta.env[key]?.trim() ?? "";

// Local-dev-only override (e.g. http://localhost:8080). When unset, the API server
// is resolved at runtime from the environment stored via the environment switcher FAB
// (see resolveActiveApiBaseUrl).
export const getAdminApiServerUrl = () => getTrimmedEnv("VITE_API_SERVER_URL");

export const resolveActiveApiBaseUrl = (): string => {
	// The override only applies to `vinext dev` (import.meta.env.DEV). Deployed builds
	// (Preview/Production) always resolve stage/prod from the stored environment selection,
	// regardless of whether VITE_API_SERVER_URL happens to still be set on Vercel.
	const localOverride = import.meta.env.DEV ? getAdminApiServerUrl() : "";
	if (localOverride) {
		return localOverride;
	}

	const storedEnvironment = loadAdminApiEnvironment();
	return getApiBaseUrlForEnvironment(storedEnvironment ?? "prod");
};
