import clsx from "clsx";

import UniversityCard from "../../ui/UniverSityCard";

import { ListUniversity } from "@/types/university";

type UniversityCardsProps = {
  colleges: ListUniversity[];
  style?: React.CSSProperties;
  className?: string;
  showCapacity?: boolean;
};

const UniversityCards = ({ colleges, style, className, showCapacity = true }: UniversityCardsProps) => (
  <div className={clsx("flex flex-col gap-2.5", className)} style={style}>
    {colleges.map((university) => (
      <UniversityCard key={university.id} university={university} showCapacity={showCapacity} />
    ))}
  </div>
);
export default UniversityCards;
