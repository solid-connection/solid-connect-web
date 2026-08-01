"use client";

import { useEffect, useState } from "react";
import type { AdminApiEnvironment } from "@/lib/auth/environment";
import { switchAdminApiEnvironment } from "@/lib/auth/session";
import {
	type DisplayedEnvironment,
	environmentLabels,
	environmentStyles,
	resolveDisplayedEnvironment,
} from "./environmentDisplay";

const nextEnvironmentOf = (environment: AdminApiEnvironment): AdminApiEnvironment =>
	environment === "stage" ? "prod" : "stage";

export function EnvironmentSwitcherFab() {
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

	const isLocal = environment === "local";

	const handleClick = () => {
		if (isLocal) {
			return;
		}

		const next = nextEnvironmentOf(environment);
		const confirmed = window.confirm(`환경을 ${environmentLabels[next]}(으)로 전환하면 로그아웃됩니다. 계속할까요?`);
		if (!confirmed) {
			return;
		}

		switchAdminApiEnvironment(next);
	};

	return (
		<button
			type="button"
			onClick={handleClick}
			disabled={isLocal}
			className={`fixed bottom-6 right-6 z-50 inline-flex items-center gap-1.5 rounded-full px-4 py-2 typo-sb-9 shadow-magic-admin-header transition disabled:cursor-not-allowed disabled:opacity-70 ${environmentStyles[environment]}`}
		>
			{environmentLabels[environment]}
		</button>
	);
}
