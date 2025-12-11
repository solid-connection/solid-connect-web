import clsx from "clsx";

import { IconCloud } from "@/public/svgs/home";

const TopLogoBar = () => (
  <div
    className={clsx(
      "max-w-app fixed top-0 z-30 flex h-14 w-full items-center",
      "bg-gradient-to-r from-primary-1 to-sub-b",
    )}
  >
    <div className="flex items-center gap-1.5 pl-5">
      <IconCloud />
      <span className="typo-sb-6 text-k-0">Solid Connection</span>
    </div>
  </div>
);

export default TopLogoBar;
