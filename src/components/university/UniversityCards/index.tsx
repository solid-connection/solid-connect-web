"use client";

import { useRef } from "react";

import clsx from "clsx";

import { useVirtualizer } from "@tanstack/react-virtual";

import UniversityCard from "../../ui/UniverSityCard";

import { ListUniversity } from "@/types/university";

type UniversityCardsProps = {
  colleges: ListUniversity[];
  style?: React.CSSProperties;
  className?: string;
  showCapacity?: boolean;
};

const ITEM_HEIGHT = 101;

const UniversityCards = ({ colleges, style, className, showCapacity = true }: UniversityCardsProps) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: colleges.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ITEM_HEIGHT,
    overscan: 5,
  });

  return (
    <div
      ref={parentRef}
      className={clsx("h-[calc(100vh-200px)] overflow-auto", className)}
      style={style}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={colleges[virtualItem.index].id}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <div className="pb-2.5">
              <UniversityCard university={colleges[virtualItem.index]} showCapacity={showCapacity} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UniversityCards;
