import { IconBlueCloud } from "@/public/svgs/home";

const WhiteTopNavigation = () => (
  <div className="shadow-custom1 fixed top-0 z-30 flex h-[56px] w-full max-w-[600px] items-center bg-white">
    <div className="flex items-center gap-1.5 pl-5">
      <IconBlueCloud />
      <span className="text-[17px] font-semibold text-primary-900">Solid Connection</span>
    </div>
  </div>
);

export default WhiteTopNavigation;
