"use client";

import { useEffect, useState } from "react";
import { getAdminApiServerUrl } from "@/lib/env";
import { loadAdminApiEnvironment } from "@/lib/utils/localStorage";

type DisplayedEnvironment = "dev" | "prod" | "local";

const environmentStyles: Record<DisplayedEnvironment, string> = {
	dev: "bg-magic-success-surface text-magic-success",
	prod: "bg-magic-danger-surface text-magic-danger",
	local: "bg-bg-50 text-k-600",
};

const environmentLabels: Record<DisplayedEnvironment, string> = {
	dev: "DEV",
	prod: "PROD",
	local: "LOCAL",
};

const resolveDisplayedEnvironment = (): DisplayedEnvironment => {
	if (import.meta.env.DEV && getAdminApiServerUrl()) {
		return "local";
	}
	return loadAdminApiEnvironment() ?? "prod";
};

export function EnvironmentBanner() {
	const [environment, setEnvironment] = useState<DisplayedEnvironment | null>(null);

	useEffect(() => {
		setEnvironment(resolveDisplayedEnvironment());

		const handleStorageChange = () => setEnvironment(resolveDisplayedEnvironment());
		window.addEventListener("storage", handleStorageChange);
		return () => window.removeEventListener("storage", handleStorageChange);
	}, []);

	if (!environment) {
		return null;
	}

	return (
		<span
			className={`inline-flex items-center rounded-full px-2.5 py-0.5 typo-medium-4 ${environmentStyles[environment]}`}
		>
			{environmentLabels[environment]}
		</span>
	);
}
