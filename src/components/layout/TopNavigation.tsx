import { IconCloud } from "@/public/svgs/home";

const TopNavigation = () => (
  <div
    className="fixed top-0 z-30 flex h-14 w-full max-w-[600px] items-center"
    style={{ background: "linear-gradient(269deg, var(--Primary-Color, #5950F6) 1.26%, #2AA4E2 100%)" }}
  >
    <div className="flex items-center gap-1.5 pl-5">
      <IconCloud />
      <span className="text-[17px] font-semibold text-k-0">Solid Connection</span>
    </div>
  </div>
);

export default TopNavigation;
