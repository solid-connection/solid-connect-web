"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import DegreeHat from "./icon/DegreeHat";
import EditTwo from "./icon/EditTwo";
import Home from "./icon/Home";
import Human from "./icon/Human";
import WhatsNew from "./icon/WhatsNew";

const BottomNavigation = () => {
  const pathname = usePathname();

  const specificRoutes = ["/university", "/community", "/mento", "/my"];
  const isSpecificRouteActive = specificRoutes.some((specificRoute) => pathname?.startsWith(specificRoute));

  const navs = [
    {
      route: "/university",
      text: "학교",
      isActive: pathname?.startsWith("/university"),
      icon: <DegreeHat color={pathname?.startsWith("/university") ? "#5950F6" : "#707070"} />,
    },
    {
      route: "/community",
      text: "커뮤니티",
      isActive: pathname?.startsWith("/community"),
      icon: <EditTwo color={pathname?.startsWith("/community") ? "#5950F6" : "#707070"} />,
    },
    {
      route: "/",
      text: "홈",
      isActive: !isSpecificRouteActive,
      icon: <Home color={!isSpecificRouteActive ? "#5950F6" : "#707070"} />,
    },
    {
      route: "/mentor",
      text: "멘토",
      isActive: pathname?.startsWith("/mentor"),
      icon: <WhatsNew color={pathname?.startsWith("/mentor") ? "#5950F6" : "#707070"} />,
    },
    {
      route: "/my",
      text: "마이",
      isActive: pathname?.startsWith("/my"),
      icon: <Human color={pathname?.startsWith("/my") ? "#5950F6" : "#707070"} />,
    },
  ];

  return (
    <nav className="fixed bottom-0 flex h-[56px] w-full max-w-[600px] bg-white [box-shadow:0px_-2px_6px_0px_var(--K50,#F5F5F5)]">
      {navs.map((nav) => (
        <Link
          key={nav.text}
          href={nav.route}
          className="flex flex-[1_0_0] flex-col items-center self-stretch px-3 pb-2 pt-1.5 no-underline"
        >
          {nav.icon}
          <span
            className={
              nav.isActive
                ? "text-center font-serif text-xs font-normal leading-[1.66] tracking-[0.4px] text-primary"
                : "text-center font-serif text-xs font-normal leading-[1.66] tracking-[0.4px] text-[rgba(0,0,0,0.6)]"
            }
          >
            {nav.text}
          </span>
        </Link>
      ))}
    </nav>
  );
};

export default BottomNavigation;
