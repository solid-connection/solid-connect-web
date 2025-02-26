import { IconCloud } from "@/public/svgs/home";

const TopNavigation = () => (
  <div className="fixed top-0 z-30 flex h-[56px] w-full max-w-[600px] items-center bg-primary">
    <div className="flex items-center gap-1.5 pl-5">
      <IconCloud />
      <span className="text-[17px] font-semibold text-k-0">Solid Connection</span>
    </div>
  </div>
);

export default TopNavigation;
