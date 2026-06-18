import { RequireAdminSession } from "@/components/features/auth/RequireAdminSession";
import { TermsPageContent } from "@/components/features/terms/TermsPageContent";

export default function TermsPage() {
	return (
		<RequireAdminSession>
			<TermsPageContent />
		</RequireAdminSession>
	);
}
