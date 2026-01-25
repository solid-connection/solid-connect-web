import clsx from "clsx";

import { IconCloud } from "@/public/svgs/home";

const TopLogoBar = () => (
  <div
    className={clsx(
      "fixed top-0 z-30 flex h-14 w-full max-w-app items-center",
      "bg-gradient-to-r from-primary-1 to-sub-b",
    )}
  >
    <div className="flex items-center gap-1.5 pl-5">
      <IconCloud />
      <span className="text-k-0 typo-sb-6">Solid Connection</span>
    </div>
  </div>
);

export default TopLogoBar;
