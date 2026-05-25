import { RequireAdminSession } from "@/components/features/auth/RequireAdminSession";
import { RegionsCountriesPageContent } from "@/components/features/regions-countries/RegionsCountriesPageContent";

export default function RegionsCountriesPage() {
	return (
		<RequireAdminSession>
			<RegionsCountriesPageContent />
		</RequireAdminSession>
	);
}
