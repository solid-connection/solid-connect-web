import { Metadata } from "next";
import React, { Suspense } from "react";

import CloudSpinner from "@/components/ui/CloudSpinner";

import UniversityPage from "./UniversityPage";

import { getUniversityListPublicApi } from "@/api/university";

export const metadata: Metadata = {
  title: "파견 학교 목록",
};

const Page = async () => {
  try {
    const { data: universities } = await getUniversityListPublicApi();
    return (
      <Suspense fallback={<CloudSpinner />}>
        <UniversityPage universities={universities} />
      </Suspense>
    );
  } catch (error) {
    console.error("Failed to fetch university list:", error);
    return (
      <Suspense fallback={<CloudSpinner />}>
        <UniversityPage universities={[]} />
      </Suspense>
    );
  }
};

export default Page;
