"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

import UniversityZoneLink from "@/components/ui/UniversityZoneLink";
import { IconCloud } from "@/public/svgs/home";
import { NAV_ITEMS } from "../BottomNavigation/constant/NAV_ITEMS";
import isRouteActive from "../BottomNavigation/lib/isRouteActive";
import DegreeHat from "../BottomNavigation/ui/DegreeHat";
import EditTwo from "../BottomNavigation/ui/EditTwo";
import Home from "../BottomNavigation/ui/Home";
import Human from "../BottomNavigation/ui/Human";
import WhatsNew from "../BottomNavigation/ui/WhatsNew";

const ICON_COMPONENTS = {
  university: DegreeHat,
  community: EditTwo,
  home: Home,
  mentor: WhatsNew,
  my: Human,
} as const;

const UNIVERSITY_ZONE_ROUTE = "/university";

const DesktopNavigation = () => {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-y-0 left-0 z-40 hidden w-[88px] flex-col border-r border-k-100 bg-white px-3 py-4 md:flex"
      aria-label="주요 메뉴"
    >
      <Link
        href="/"
        className="flex h-14 w-full items-center justify-center rounded-2xl bg-primary text-k-0"
        aria-label="홈으로 이동"
      >
        <IconCloud />
      </Link>

      <div className="mt-6 flex flex-1 flex-col gap-2">
        {NAV_ITEMS.map(({ route, text, iconType }) => {
          const isActive = isRouteActive(pathname, route);
          const IconComp = ICON_COMPONENTS[iconType];
          const className = clsx(
            "flex h-[70px] flex-col items-center justify-center gap-1 rounded-2xl text-center transition-colors typo-medium-5",
            isActive ? "bg-primary-100 text-primary" : "text-k-500 hover:bg-k-50 hover:text-k-700",
          );
          const content = (
            <>
              <IconComp />
              <span>{text}</span>
            </>
          );

          if (route === UNIVERSITY_ZONE_ROUTE) {
            return (
              <UniversityZoneLink
                key={text}
                href={route}
                aria-current={isActive ? "page" : undefined}
                aria-label={`${text} 페이지로 이동`}
                className={className}
              >
                {content}
              </UniversityZoneLink>
            );
          }

          return (
            <Link
              key={text}
              href={route}
              aria-current={isActive ? "page" : undefined}
              aria-label={`${text} 페이지로 이동`}
              className={className}
            >
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default DesktopNavigation;
