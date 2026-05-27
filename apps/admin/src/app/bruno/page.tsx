import { RequireAdminSession } from "@/components/features/auth/RequireAdminSession";
import { BrunoApiPageContent } from "@/components/features/bruno/BrunoApiPageContent";

export default function BrunoPage() {
	return (
		<RequireAdminSession>
			<BrunoApiPageContent />
		</RequireAdminSession>
	);
}
