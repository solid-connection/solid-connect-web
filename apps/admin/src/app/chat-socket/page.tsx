import { RequireAdminSession } from "@/components/features/auth/RequireAdminSession";
import { ChatSocketPageContent } from "@/components/features/chat-socket/ChatSocketPageContent";

export default function ChatSocketPage() {
	return (
		<RequireAdminSession>
			<ChatSocketPageContent />
		</RequireAdminSession>
	);
}
