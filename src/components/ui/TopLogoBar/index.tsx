import clsx from "clsx";

import { IconCloud } from "@/public/svgs/home";

const TopLogoBar = () => (
  <div
    className={clsx(
      "fixed top-0 z-30 flex h-14 w-full max-w-[600px] items-center",
      "bg-gradient-to-r from-primary-1 to-sub-b",
    )}
  >
    <div className="flex items-center gap-1.5 pl-5">
      <IconCloud />
      <span className="text-[17px] font-semibold text-k-0">Solid Connection</span>
    </div>
  </div>
);

export default TopLogoBar;
