import { createFileRoute } from "@tanstack/react-router";
import { BrunoApiPageContent } from "@/components/features/bruno/BrunoApiPageContent";
import { requireAdminSession } from "@/lib/auth/tanstackRouteGuards";

export const Route = createFileRoute("/bruno/")({
	beforeLoad: async () => {
		await requireAdminSession();
	},
	component: BrunoApiPageContent,
});
