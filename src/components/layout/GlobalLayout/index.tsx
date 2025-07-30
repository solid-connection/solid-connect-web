import React from "react";

import BottomNavigation from "./ui/BottomNavigation";
import RootModal from "./ui/RootModal";

type LayoutProps = {
  children: React.ReactNode;
};

const GlobalLayout = ({ children }: LayoutProps) => {
  return (
    <div className="mx-auto mb-14 w-full min-w-[360px] max-w-[600px] pt-14">
      {children}
      <BottomNavigation />
      <RootModal />
    </div>
  );
};

export default GlobalLayout;
