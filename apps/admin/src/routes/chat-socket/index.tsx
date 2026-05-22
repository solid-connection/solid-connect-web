import { createFileRoute } from "@tanstack/react-router";
import { ChatSocketPageContent } from "@/components/features/chat-socket/ChatSocketPageContent";
import { requireAdminSession } from "@/lib/auth/tanstackRouteGuards";

export const Route = createFileRoute("/chat-socket/")({
	beforeLoad: async () => {
		await requireAdminSession();
	},
	component: ChatSocketPageContent,
});
