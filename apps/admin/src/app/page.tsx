"use client";

import { useEffect } from "react";
import { ensureSessionToken } from "@/lib/auth/session";

export default function HomePage() {
	useEffect(() => {
		const redirectBySession = async () => {
			try {
				const token = await ensureSessionToken();
				window.location.replace(token ? "/scores" : "/auth/login");
			} catch {
				window.location.replace("/auth/login");
			}
		};

		void redirectBySession();
	}, []);

	return (
		<div className="flex min-h-screen items-center justify-center bg-bg-50 typo-medium-3 text-k-500">
			관리자 페이지로 이동하는 중...
		</div>
	);
}
