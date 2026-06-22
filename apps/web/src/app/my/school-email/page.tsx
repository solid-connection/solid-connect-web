import type { Metadata } from "next";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
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
      <SchoolEmailVerificationContent />
    </>
  );
};

export default SchoolEmailVerificationPage;
