"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

const BottomNavigation = () => {
  const pathname = usePathname();

  if (!NAV_ITEMS.some((item) => isRouteActive(pathname, item.route))) {
    return null;
  }

  return (
    <nav className="max-w-app fixed bottom-0 flex h-[56px] w-full bg-white [box-shadow:0px_-2px_6px_0px_var(--K50,#F5F5F5)]">
      {NAV_ITEMS.map(({ route, text, iconType }) => {
        const isActive = isRouteActive(pathname, route);
        return (
          <Link
            key={text}
            href={route}
            aria-current={isActive ? "page" : undefined}
            aria-label={`${text} 페이지로 이동`}
            className="flex flex-[1_0_0] flex-col items-center self-stretch px-3 pb-2 pt-1.5 no-underline"
          >
            {(() => {
              const IconComp = ICON_COMPONENTS[iconType];
              return <IconComp color={isActive ? "#5950F6" : undefined} />;
            })()}
            <span
              className={
                isActive
                  ? "text-center font-serif typo-regular-4 tracking-[0.4px] text-primary"
                  : "text-center font-serif typo-regular-4 tracking-[0.4px] text-black/60"
              }
            >
              {text}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNavigation;
