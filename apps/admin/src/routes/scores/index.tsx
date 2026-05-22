import { createFileRoute } from "@tanstack/react-router";
import { ScoresPageContent } from "@/components/features/scores/ScoresPageContent";
import { requireAdminSession } from "@/lib/auth/tanstackRouteGuards";

export const Route = createFileRoute("/scores/")({
	beforeLoad: async () => {
		await requireAdminSession();
	},
	component: ScoresPageContent,
});
