"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

const UNIVERSITY_ZONE_ROUTE_PREFIX = "/university";
const mainWebOrigin = process.env.NEXT_PUBLIC_WEB_URL?.replace(/\/$/, "");

const getMainWebHref = (route: string) => {
  if (!mainWebOrigin) {
    return route;
  }

  return `${mainWebOrigin}${route === "/" ? "" : route}`;
};

const DesktopNavigation = () => {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-40 hidden h-[72px] border-b border-k-100 bg-white md:block" aria-label="주요 메뉴">
      <div className="mx-auto flex h-full w-full max-w-[1280px] items-center px-8 lg:px-10">
        <a href={getMainWebHref("/")} className="flex shrink-0 items-center gap-3" aria-label="홈으로 이동">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-k-0">
            <IconCloud />
          </span>
          <span className="text-k-900 typo-sb-6">Solid Connection</span>
        </a>

        <div className="ml-10 flex min-w-0 flex-1 items-center gap-1">
          {NAV_ITEMS.map(({ route, text, iconType }) => {
            const isActive = isRouteActive(pathname, route);
            const IconComp = ICON_COMPONENTS[iconType];
            const className = clsx(
              "flex h-10 min-w-[88px] items-center justify-center gap-2 rounded-lg px-3 transition-colors typo-sb-9",
              isActive ? "bg-primary-100 text-primary" : "text-k-500 hover:bg-k-50 hover:text-k-700",
            );
            const content = (
              <>
                <span className="flex size-6 items-center justify-center" aria-hidden>
                  <IconComp />
                </span>
                <span>{text}</span>
              </>
            );

            if (!route.startsWith(UNIVERSITY_ZONE_ROUTE_PREFIX)) {
              return (
                <a
                  key={text}
                  href={getMainWebHref(route)}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={`${text} 페이지로 이동`}
                  className={className}
                >
                  {content}
                </a>
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
      </div>
    </nav>
  );
};

export default DesktopNavigation;
