"use client";

import { useEffect } from "react";

export default function LoginRedirectPage() {
	useEffect(() => {
		window.location.replace("/auth/login");
	}, []);

	return (
		<div className="flex min-h-screen items-center justify-center bg-bg-50 typo-medium-3 text-k-500">
			로그인 페이지로 이동하는 중...
		</div>
	);
}
