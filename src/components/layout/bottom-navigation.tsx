"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import DegreeHat from "./icon/DegreeHat";
import EditTwo from "./icon/EditTwo";
import Home from "./icon/Home";
import Human from "./icon/Human";
import WhatsNew from "./icon/WhatsNew";

export default function BottomNavigation() {
  const pathname = usePathname();

  const specificRoutes = ["/college", "/community", "/mento", "/my"];
  const isSpecificRouteActive = specificRoutes.some((specificRoute) => pathname.startsWith(specificRoute));

  const navs = [
    {
      route: "/college",
      text: "학교",
      isActive: pathname.startsWith("/college"),
      icon: <DegreeHat color={pathname.startsWith("/college") ? "#6F96D1" : "#707070"} />,
    },
    {
      route: "/community",
      text: "커뮤니티",
      isActive: pathname.startsWith("/community"),
      icon: <EditTwo color={pathname.startsWith("/community") ? "#6F96D1" : "#707070"} />,
    },
    {
      route: "/",
      text: "홈",
      isActive: !isSpecificRouteActive,
      icon: <Home color={!isSpecificRouteActive ? "#6F96D1" : "#707070"} />,
    },
    {
      route: "/mento",
      text: "멘토",
      isActive: pathname.startsWith("/mento"),
      icon: <WhatsNew color={pathname.startsWith("/mento") ? "#6F96D1" : "#707070"} />,
    },
    {
      route: "/my",
      text: "마이",
      isActive: pathname.startsWith("/my"),
      icon: <Human color={pathname.startsWith("/my") ? "#6F96D1" : "#707070"} />,
    },
  ];

  return (
    <nav className="fixed bottom-0 flex h-[56px] w-full max-w-[600px] bg-white">
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
                ? "text-center font-serif text-xs font-normal leading-[1.66] tracking-[0.4px] text-[rgba(25,118,210,0.6)]"
                : "text-center font-serif text-xs font-normal leading-[1.66] tracking-[0.4px] text-[rgba(0,0,0,0.6)]"
            }
          >
            {nav.text}
          </span>
        </Link>
      ))}
    </nav>
  );
}
