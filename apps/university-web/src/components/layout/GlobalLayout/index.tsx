import type { ReactNode } from "react";

import AIInspectorFab from "./ui/AIInspectorFab/index";
import BottomNavigation from "./ui/BottomNavigation";
import ClientModal from "./ui/ClientModal";
import DesktopNavigation from "./ui/DesktopNavigation";

// import ServerModal from "./ui/ServerModal";

// const BottomNavigationDynamic = dynamic(() => import("./ui/BottomNavigation"), { ssr: false, loading: () => null });

type LayoutProps = {
  children: ReactNode;
};

const GlobalLayout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-white md:bg-k-50">
      <DesktopNavigation />
      <div className="mx-auto mb-14 min-h-screen w-full min-w-app max-w-app bg-white pt-14 md:mb-0 md:min-h-[calc(100vh-72px)] md:min-w-0 md:max-w-[1440px] md:bg-k-50 md:pt-0">
        {children}
        <BottomNavigation />
        <AIInspectorFab />
        <ClientModal />
        {/* <ServerModal /> */}
      </div>
    </div>
  );
};

export default GlobalLayout;
