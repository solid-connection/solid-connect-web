import { getUniversityListPublicApi } from "@/services/university";

import UniversityPage from "./UniversityPage";

export const metadata = {
  title: "솔리드 커넥션",
};

export default async function Page() {
  let universities = [];
  try {
    const res = await getUniversityListPublicApi();
    universities = res.data;
  } catch (error) {
    console.error(error);
  }

  return <UniversityPage universities={universities} />;
}
