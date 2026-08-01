import type { AdminApiEnvironment } from "@/lib/auth/environment";
import { getAdminApiServerUrl } from "@/lib/env";
import { loadAdminApiEnvironment } from "@/lib/utils/localStorage";

export type DisplayedEnvironment = AdminApiEnvironment | "local";

export const environmentStyles: Record<DisplayedEnvironment, string> = {
	stage: "bg-magic-success-surface text-magic-success",
	prod: "bg-magic-danger-surface text-magic-danger",
	local: "bg-bg-50 text-k-600",
};

export const environmentLabels: Record<DisplayedEnvironment, string> = {
	stage: "STAGE",
	prod: "PROD",
	local: "LOCAL",
};

export const resolveDisplayedEnvironment = (): DisplayedEnvironment => {
	if (import.meta.env.DEV && getAdminApiServerUrl()) {
		return "local";
	}
	return loadAdminApiEnvironment() ?? "prod";
};
