import { RequireAdminSession } from "@/components/features/auth/RequireAdminSession";
import { HomeUniversitiesPageContent } from "@/components/features/home-universities/HomeUniversitiesPageContent";

export default function HomeUniversitiesPage() {
	return (
		<RequireAdminSession>
			<HomeUniversitiesPageContent />
		</RequireAdminSession>
	);
}
