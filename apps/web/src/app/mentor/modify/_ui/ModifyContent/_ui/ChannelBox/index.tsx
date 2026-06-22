import { useFormContext, useWatch } from "react-hook-form";

import type { ChannelType } from "@/types/mentor";
import ChannelItem from "./ChannelItem";

const MAX_CHANNELS = 4;

interface ChannelBoxProps {
  channels: Array<{ type: ChannelType; url: string }>;
}

const ChannelBox = ({ channels }: ChannelBoxProps) => {
  const { control } = useFormContext();
  const watchedChannels = useWatch({ control, name: "channels" }) as
    | Array<{ type: ChannelType | null; url: string }>
    | undefined;

  const completedCount = (watchedChannels ?? []).filter(
    (channel) => channel?.type !== null && channel?.type !== undefined && Boolean(channel?.url?.trim()),
  ).length;
  const visibleCount = Math.min(completedCount + 1, MAX_CHANNELS);

  return (
    <>
      {Array.from({ length: visibleCount }, (_, index) => (
        <ChannelItem key={index} index={index} channel={channels[index]} />
      ))}
    </>
  );
};

// ChannelBox.displayName = "ChannelBox";

export default ChannelBox;
