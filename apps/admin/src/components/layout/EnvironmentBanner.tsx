"use client";

import { useEffect, useState } from "react";
import {
	type DisplayedEnvironment,
	environmentLabels,
	environmentStyles,
	resolveDisplayedEnvironment,
} from "./environmentDisplay";

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
