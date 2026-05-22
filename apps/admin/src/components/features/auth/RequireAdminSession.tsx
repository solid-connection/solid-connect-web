"use client";

import { type ReactNode, useEffect, useState } from "react";
import { ensureSessionToken } from "@/lib/auth/session";

interface RequireAdminSessionProps {
	children: ReactNode;
}

export function RequireAdminSession({ children }: RequireAdminSessionProps) {
	const [isAuthorized, setIsAuthorized] = useState(false);

	useEffect(() => {
		let isMounted = true;

		const checkSession = async () => {
			const token = await ensureSessionToken();
			if (!isMounted) return;

			if (!token) {
				window.location.replace("/auth/login");
				return;
			}

			setIsAuthorized(true);
		};

		void checkSession();

		return () => {
			isMounted = false;
		};
	}, []);

	if (!isAuthorized) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-bg-50 typo-medium-3 text-k-500">
				관리자 세션을 확인하는 중...
			</div>
		);
	}

	return children;
}
