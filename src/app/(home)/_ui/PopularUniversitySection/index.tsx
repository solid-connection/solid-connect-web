import PopularUniversityCard from "./_ui/PopularUniversityCard";

import { ListUniversity } from "@/types/university";

type PopularUniversitySectionProps = {
  universities: ListUniversity[];
};

const PopularUniversitySection = ({ universities }: PopularUniversitySectionProps) => {
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-2">
        {universities.map((university, index) => (
          <PopularUniversityCard
            key={university.id}
            university={university}
            priority={index === 0} // 첫 번째만 priority로 LCP 최적화
            loading={index < 3 ? "eager" : "lazy"} // 첫 3개는 즉시, 나머지는 지연 로딩
            fetchPriority={index === 0 ? "high" : "low"} // 첫 번째만 높은 우선순위
            quality={index === 0 ? 60 : 50} // 첫 번째는 고품질, 나머지는 압축
          />
        ))}
      </div>
    </div>
  );
};

export default PopularUniversitySection;
