import type { Metadata } from "next";
import { Suspense } from "react";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import CloudSpinnerPage from "@/components/ui/CloudSpinnerPage";
import { NO_INDEX_ROBOTS } from "@/utils/seo";

import SchoolEmailVerificationContent from "./_ui/SchoolEmailVerificationContent";

export const metadata: Metadata = {
  title: "학교 인증하기",
  robots: NO_INDEX_ROBOTS,
};

const SchoolEmailVerificationPage = () => {
  return (
    <>
      <TopDetailNavigation title="학교 인증하기" />
      <Suspense fallback={<CloudSpinnerPage />}>
        <SchoolEmailVerificationContent />
      </Suspense>
    </>
  );
};

export default SchoolEmailVerificationPage;
