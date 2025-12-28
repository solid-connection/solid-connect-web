"use client";

import { useRef } from "react";

import clsx from "clsx";

import UniversityCard from "../../ui/UniverSityCard";

import { ListUniversity } from "@/types/university";

import { useVirtualizer } from "@tanstack/react-virtual";

type UniversityCardsProps = {
  colleges: ListUniversity[];
  style?: React.CSSProperties;
  className?: string;
  showCapacity?: boolean;
  enableVirtualization?: boolean;
};

const ITEM_HEIGHT = 101;

const UniversityCards = ({
  colleges,
  style,
  className,
  showCapacity = true,
  enableVirtualization = true,
}: UniversityCardsProps) => {
  // 가상화가 비활성화된 경우 일반 렌더링
  if (!enableVirtualization) {
    return (
      <div className={clsx("flex flex-col gap-2.5", className)} style={style}>
        {colleges.map((college) => (
          <div key={college.id} className="pb-2.5">
            <UniversityCard university={college} showCapacity={showCapacity} />
          </div>
        ))}
      </div>
    );
  }

  // 가상화 사용 (기존 로직)
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: colleges.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ITEM_HEIGHT,
    overscan: 5,
  });

  return (
    <div ref={parentRef} className={clsx("h-[calc(100vh-200px)] overflow-auto", className)} style={style}>
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
