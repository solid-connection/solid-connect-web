import type { ReactNode } from "react";

import BottomNavigation from "./ui/BottomNavigation";
import ClientModal from "./ui/ClientModal";

// import ServerModal from "./ui/ServerModal";

type LayoutProps = {
  children: ReactNode;
};

const GlobalLayout = ({ children }: LayoutProps) => {
  return (
    <div className="mx-auto mb-14 w-full min-w-app max-w-app pt-14">
      {children}
      <BottomNavigation />
      <ClientModal />
      {/* <ServerModal /> */}
    </div>
  );
};

export default GlobalLayout;
