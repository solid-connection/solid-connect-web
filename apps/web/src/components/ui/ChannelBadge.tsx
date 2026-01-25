import { ChannelType } from "@/types/mentor";

interface ChannelBadgeProps {
  channelType: ChannelType;
  text?: string;
}

const ChannelBadge = ({ channelType, text }: ChannelBadgeProps) => {
  return (
    <div
      className={`flex h-full w-full items-center justify-center gap-[10px] rounded px-2 py-[3px] typo-medium-2 ${
        channelType === ChannelType.BLOG
          ? "bg-sub-e-100 text-sub-e-500"
          : channelType === ChannelType.BRUNCH
            ? "bg-sub-c-100 text-sub-c-500"
            : channelType === ChannelType.INSTAGRAM
              ? "bg-sub-d-100 text-sub-d-500"
              : channelType === ChannelType.YOUTUBE
                ? "bg-sub-f-100 text-sub-f-500"
                : "bg-gray-100"
      }`}
    >
      {text ? text : channelType}
    </div>
  );
};

export default ChannelBadge;
