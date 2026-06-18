import { RequireAdminSession } from "@/components/features/auth/RequireAdminSession";
import { UnivApplyInfosPageContent } from "@/components/features/univ-apply-infos/UnivApplyInfosPageContent";

export default function UnivApplyInfosPage() {
	return (
		<RequireAdminSession>
			<UnivApplyInfosPageContent />
		</RequireAdminSession>
	);
}
