import React from "react";

import { useLayout } from "../../context/LayoutContext";
import BottomNavigation from "./bottom-navigation";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const { hideBottomNavigation } = useLayout();
  return (
    <div className="mx-auto mb-[56px] w-full min-w-[360px] max-w-[600px] pt-[56px]">
      {children}
      {!hideBottomNavigation && <BottomNavigation />}
    </div>
  );
};

export default Layout;
