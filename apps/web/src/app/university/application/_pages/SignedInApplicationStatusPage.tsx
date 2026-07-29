"use client";

import { useUniversitySearch } from "@/apis/universities";
import RestrictedApplicationStatusView from "../_components/RestrictedApplicationStatusView";

const SignedInApplicationStatusPage = () => {
  const { data: universities = [], isLoading } = useUniversitySearch("", undefined, { useDefaultTermId: true });

  return <RestrictedApplicationStatusView universities={universities} isLoading={isLoading} />;
};

export default SignedInApplicationStatusPage;
