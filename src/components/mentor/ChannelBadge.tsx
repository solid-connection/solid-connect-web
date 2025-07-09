import { ChannelType } from "@/types/mentor";

interface ChannelBadgeProps {
  channerType: ChannelType;
  text?: string;
}

const ChannelBadge = ({ channerType, text }: ChannelBadgeProps) => {
  return (
    <div
      className={`flex h-full w-full items-center justify-center gap-[10px] rounded px-2 py-[3px] text-sm font-medium ${
        channerType === ChannelType.BLOG
          ? "bg-sub-e-100 text-sub-e-500"
          : channerType === ChannelType.BRUNCH
            ? "bg-sub-c-100 text-sub-c-500"
            : channerType === ChannelType.INSTAGRAM
              ? "bg-sub-d-100 text-sub-d-500"
              : channerType === ChannelType.YOUTUBE
                ? "bg-sub-f-100 text-sub-f-500"
                : "bg-gray-100"
      }`}
    >
      {text ? text : channerType}
    </div>
  );
};

export default ChannelBadge;
