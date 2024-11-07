import { getUniversityListPublicApi } from "@/services/university";

import UniversityPage from "./UniversityPage";

export const metadata = {
  title: "솔리드 커넥션",
};

const Page = async () => {
  try {
    const { data: universities } = await getUniversityListPublicApi();
    return <UniversityPage universities={universities} />;
  } catch (error) {
    console.error("Failed to fetch university list:", error);
    return <UniversityPage universities={[]} />;
  }
};

export default Page;
