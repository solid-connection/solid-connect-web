import { redirect } from "@tanstack/react-router";
import { ensureSessionToken } from "./session";

export const requireAdminSession = async (): Promise<string> => {
	const token = await ensureSessionToken();
	if (!token) {
		throw redirect({ to: "/auth/login" });
	}

	return token;
};

export const redirectIfAuthenticated = async () => {
	const token = await ensureSessionToken();
	if (token) {
		throw redirect({ to: "/scores" });
	}
};
