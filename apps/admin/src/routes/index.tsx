import { createFileRoute, redirect } from "@tanstack/react-router";
import { ensureSessionToken } from "@/lib/auth/session";

export const Route = createFileRoute("/")({
	beforeLoad: async () => {
		const token = await ensureSessionToken();
		throw redirect({ to: token ? "/scores" : "/auth/login" });
	},
});
