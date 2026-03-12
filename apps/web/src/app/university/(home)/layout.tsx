import type { ReactNode } from "react";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

interface LayoutProps {
  children: ReactNode;
}

const UniversityHomeLayout = ({ children }: LayoutProps) => {
  return (
    <>
      <TopDetailNavigation title="대학교 선택" />
      {children}
    </>
  );
};

export default UniversityHomeLayout;
