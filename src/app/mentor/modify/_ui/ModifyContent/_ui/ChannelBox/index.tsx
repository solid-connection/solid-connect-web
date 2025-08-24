import React from "react";

import ChannelItem from "./ChannelItem";

import { ChannelType } from "@/types/mentor";

interface ChannelBoxProps {
  channels: Array<{ type: ChannelType; url: string }>;
}

const ChannelBox = ({ channels }: ChannelBoxProps) => {
  return (
    <>
      {Array.from({ length: 4 }, (_, index) => (
        <ChannelItem key={index} index={index} channel={channels[index]} />
      ))}
    </>
  );
};

// ChannelBox.displayName = "ChannelBox";

export default ChannelBox;
