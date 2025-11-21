import React from "react";

import BottomNavigation from "./ui/BottomNavigation";
import ClientModalWrapper from "./ui/ClientModalWrapper";

// import ServerModal from "./ui/ServerModal";

type LayoutProps = {
  children: React.ReactNode;
};

const GlobalLayout = ({ children }: LayoutProps) => {
  return (
    <div className="mx-auto mb-14 w-full min-w-[360px] max-w-[600px] pt-14">
      {children}
      <BottomNavigation />
      <ClientModalWrapper />
      {/* <ServerModal /> */}
    </div>
  );
};

export default GlobalLayout;
