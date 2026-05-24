import { RequireAdminSession } from "@/components/features/auth/RequireAdminSession";
import { ScoresPageContent } from "@/components/features/scores/ScoresPageContent";

export default function ScoresPage() {
	return (
		<RequireAdminSession>
			<ScoresPageContent />
		</RequireAdminSession>
	);
}
