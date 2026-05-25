"use client";

import { useEffect, useState } from "react";
import { AdminLoginPage } from "@/components/features/auth/AdminLoginPage";
import { ensureSessionToken } from "@/lib/auth/session";

export default function AuthLoginPage() {
	const [canRenderLogin, setCanRenderLogin] = useState(false);

	useEffect(() => {
		let isMounted = true;

		const redirectIfAuthenticated = async () => {
			const shouldSkipSessionCheck = new URLSearchParams(window.location.search).get("loggedOut") === "1";
			if (shouldSkipSessionCheck) {
				setCanRenderLogin(true);
				return;
			}

			try {
				const token = await ensureSessionToken();
				if (!isMounted) return;

				if (token) {
					window.location.replace("/scores");
					return;
				}
			} catch {
				// 세션 확인 실패 시에도 로그인 화면은 열어둔다.
			}

			if (!isMounted) return;
			setCanRenderLogin(true);
		};

		void redirectIfAuthenticated();

		return () => {
			isMounted = false;
		};
	}, []);

	if (!canRenderLogin) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-bg-50 typo-medium-3 text-k-500">
				관리자 세션을 확인하는 중...
			</div>
		);
	}

	return <AdminLoginPage onLoginSuccess={() => window.location.assign("/scores")} />;
}
