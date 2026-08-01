"use client";

import { useGetApplicationPreview } from "@/apis/applications";
import RestrictedApplicationStatusView from "../_components/RestrictedApplicationStatusView";

const SignedInApplicationStatusPage = () => {
  const { data, isLoading } = useGetApplicationPreview();

  return (
    <RestrictedApplicationStatusView
      totalUniversityCount={data?.totalUniversityCount}
      universities={data?.universities}
      isLoading={isLoading}
    />
  );
};

export default SignedInApplicationStatusPage;
