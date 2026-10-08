"use client";

import { useWindowVirtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";

import type { ListUniversity } from "@/types/university";
import UniversityCard from "../../ui/UniverSityCard";

const UNIVERSITY_CARD_HEIGHT = 91;
const UNIVERSITY_CARD_BOTTOM_PADDING = 10;
const UNIVERSITY_CARD_GAP = 10;
const ESTIMATED_UNIVERSITY_CARD_ROW_HEIGHT = UNIVERSITY_CARD_HEIGHT + UNIVERSITY_CARD_BOTTOM_PADDING;
const INITIAL_VIEWPORT_HEIGHT = 900;

type UniversityCardsProps = {
  colleges: ListUniversity[];
  style?: React.CSSProperties;
  className?: string;
  showCapacity?: boolean;
  linkPrefix?: string;
};

const UniversityCards = ({ colleges, style, className, showCapacity = true, linkPrefix }: UniversityCardsProps) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [scrollMargin, setScrollMargin] = useState(0);

  const measureScrollMargin = useCallback(() => {
    if (!listRef.current) {
      return;
    }

    setScrollMargin(listRef.current.getBoundingClientRect().top + window.scrollY);
  }, []);

  useEffect(() => {
    measureScrollMargin();

    const animationFrameId = window.requestAnimationFrame(measureScrollMargin);
    window.addEventListener("resize", measureScrollMargin);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", measureScrollMargin);
    };
  }, [measureScrollMargin]);

  const getItemKey = useCallback((index: number) => colleges[index]?.id ?? index, [colleges]);

  const virtualizer = useWindowVirtualizer({
    count: colleges.length,
    estimateSize: () => ESTIMATED_UNIVERSITY_CARD_ROW_HEIGHT,
    gap: UNIVERSITY_CARD_GAP,
    getItemKey,
    overscan: 6,
    scrollMargin,
    initialRect: {
      width: 0,
      height: INITIAL_VIEWPORT_HEIGHT,
    },
    useFlushSync: false,
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <>
      <div
        ref={listRef}
        className={clsx("relative w-full md:hidden", className)}
        role="list"
        style={{
          ...style,
          height: `${virtualizer.getTotalSize()}px`,
        }}
      >
        {virtualItems.map((virtualItem) => {
          const college = colleges[virtualItem.index];

          if (!college) {
            return null;
          }

          return (
            <div
              key={virtualItem.key}
              ref={virtualizer.measureElement}
              className="absolute left-0 top-0 w-full pb-2.5"
              data-index={virtualItem.index}
              role="listitem"
              aria-posinset={virtualItem.index + 1}
              aria-setsize={colleges.length}
              style={{
                transform: `translateY(${virtualItem.start - virtualizer.options.scrollMargin}px)`,
              }}
            >
              <UniversityCard university={college} showCapacity={showCapacity} linkPrefix={linkPrefix} />
            </div>
          );
        })}
      </div>
      <div className={clsx("hidden gap-4 md:grid md:grid-cols-2 xl:grid-cols-3", className)} style={style}>
        {colleges.map((college) => (
          <div key={college.id}>
            <UniversityCard university={college} showCapacity={showCapacity} linkPrefix={linkPrefix} />
          </div>
        ))}
      </div>
    </>
  );
};

export default UniversityCards;
