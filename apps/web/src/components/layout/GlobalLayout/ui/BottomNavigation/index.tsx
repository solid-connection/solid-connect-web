"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import UniversityZoneLink from "@/components/ui/UniversityZoneLink";
import { NAV_ITEMS } from "./constant/NAV_ITEMS";
import isRouteActive from "./lib/isRouteActive";
import DegreeHat from "./ui/DegreeHat";
import EditTwo from "./ui/EditTwo";
import Home from "./ui/Home";
import Human from "./ui/Human";
import WhatsNew from "./ui/WhatsNew";

const ICON_COMPONENTS = {
  university: DegreeHat,
  community: EditTwo,
  home: Home,
  mentor: WhatsNew,
  my: Human,
} as const;

const UNIVERSITY_ZONE_ROUTE = "/university";

const BottomNavigation = () => {
  const pathname = usePathname();

  if (!NAV_ITEMS.some((item) => isRouteActive(pathname, item.route))) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 flex h-[56px] w-full max-w-app bg-white shadow-magic-bottom-nav">
      {NAV_ITEMS.map(({ route, text, iconType }) => {
        const isActive = isRouteActive(pathname, route);
        const className = `flex flex-[1_0_0] flex-col items-center self-stretch px-3 pb-2 pt-1.5 no-underline ${
          isActive ? "text-primary" : "text-magic-nav-inactive"
        }`;
        const content = (
          <>
            {(() => {
              const IconComp = ICON_COMPONENTS[iconType];
              return <IconComp />;
            })()}
            <span
              className={
                isActive
                  ? "text-center font-serif tracking-[0.4px] text-primary typo-regular-4"
                  : "text-center font-serif tracking-[0.4px] text-black/60 typo-regular-4"
              }
            >
              {text}
            </span>
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
    </nav>
  );
};

export default BottomNavigation;
