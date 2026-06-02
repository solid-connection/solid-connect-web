"use client";

import clsx from "clsx";

import type { ListUniversity } from "@/types/university";
import UniversityCard from "../../ui/UniverSityCard";

type UniversityCardsProps = {
  colleges: ListUniversity[];
  style?: React.CSSProperties;
  className?: string;
  showCapacity?: boolean;
  linkPrefix?: string;
};

const UniversityCards = ({ colleges, style, className, showCapacity = true, linkPrefix }: UniversityCardsProps) => {
  return (
    <div className={clsx("flex flex-col gap-2.5", className)} style={style}>
      {colleges.map((college) => (
        <div key={college.id} className="pb-2.5">
          <UniversityCard university={college} showCapacity={showCapacity} linkPrefix={linkPrefix} />
        </div>
      ))}
    </div>
  );
};

export default UniversityCards;
