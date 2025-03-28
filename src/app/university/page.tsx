import { Metadata } from "next";
import React, { Suspense } from "react";

import { getUniversityListPublicApi } from "@/services/university";

import UniversityPage from "./UniversityPage";

export const metadata: Metadata = {
  title: "파견 학교 목록",
};

const Page = async () => {
  try {
    const { data: universities } = await getUniversityListPublicApi();
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <UniversityPage universities={universities} />
      </Suspense>
    );
  } catch (error) {
    console.error("Failed to fetch university list:", error);
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <UniversityPage universities={[]} />
      </Suspense>
    );
  }
};

export default Page;
