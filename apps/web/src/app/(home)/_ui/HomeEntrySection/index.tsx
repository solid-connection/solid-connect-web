"use client";

import useAuthStore from "@/lib/zustand/useAuthStore";
import HomeActionLinks from "../HomeActionLinks";
import HomeUniversitySearchSection from "../HomeUniversitySearchSection";
import HomeEntrySectionSkeleton from "./skeleton";

const HomeEntrySection = () => {
  const { isAuthenticated, isInitialized } = useAuthStore();

  if (!isInitialized) {
    return <HomeEntrySectionSkeleton />;
  }

  return isAuthenticated ? <HomeActionLinks /> : <HomeUniversitySearchSection />;
};

export default HomeEntrySection;
