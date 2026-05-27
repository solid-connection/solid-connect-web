import { RequireAdminSession } from "@/components/features/auth/RequireAdminSession";
import { MentorApplicationsPageContent } from "@/components/features/mentor-applications/MentorApplicationsPageContent";

export default function MentorApplicationsPage() {
	return (
		<RequireAdminSession>
			<MentorApplicationsPageContent />
		</RequireAdminSession>
	);
}
