import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AdminLoginPage } from "@/components/features/auth/AdminLoginPage";
import { redirectIfAuthenticated } from "@/lib/auth/tanstackRouteGuards";

export const Route = createFileRoute("/auth/login")({
	beforeLoad: async () => {
		await redirectIfAuthenticated();
	},
	component: LoginRoute,
});

function LoginRoute() {
	const navigate = useNavigate();

	return <AdminLoginPage onLoginSuccess={() => void navigate({ to: "/scores" })} />;
}
