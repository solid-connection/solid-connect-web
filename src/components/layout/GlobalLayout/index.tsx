import dynamic from "next/dynamic";
import React from "react";

import BottomNavigation from "./ui/BottomNavigation";

// import ServerModal from "./ui/ServerModal";

// const BottomNavigationDynamic = dynamic(() => import("./ui/BottomNavigation"), { ssr: false, loading: () => null });
const ClientModal = dynamic(() => import("./ui/ClientModal"), { ssr: false, loading: () => null });

type LayoutProps = {
  children: React.ReactNode;
};

const GlobalLayout = ({ children }: LayoutProps) => {
  return (
    <div className="min-w-app max-w-app mx-auto mb-14 w-full pt-14">
      {children}
      <BottomNavigation />
      <ClientModal />
      {/* <ServerModal /> */}
    </div>
  );
};

export default GlobalLayout;
