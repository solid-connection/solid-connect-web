import { getUniversityListPublicApi } from "@/services/university";

import UniversityPage from "./UniversityPage";

export const metadata = {
  title: "솔리드 커넥션",
};

const Page = async () => {
  let universities = [];
  try {
    const res = await getUniversityListPublicApi();
    universities = res.data;
  } catch (error) {
    console.error(error);
  }

  return <UniversityPage universities={universities} />;
};

export default Page;
