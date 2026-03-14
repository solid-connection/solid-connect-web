import type { ListUniversity } from "@/types/university";
import PopularUniversityCard from "./_ui/PopularUniversityCard";

type PopularUniversitySectionProps = {
  universities: ListUniversity[];
};

const PopularUniversitySection = ({ universities }: PopularUniversitySectionProps) => {
  const aboveFold = universities.slice(0, 3);
  const belowFold = universities.slice(3);

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-2">
        {/* 첫 3장은 즉시 전송 – LCP 후보 */}
        {aboveFold.map((university, index) => (
          <PopularUniversityCard
            priority={index === 0} // 첫 번째만 priority
            loading="eager" // 즉시 로딩
            fetchPriority="high" // 높은 우선순위
            quality={index === 0 ? 60 : 55} // LCP는 60, 나머지는 55로 최적화
            key={university.id}
            university={university}
          />
        ))}

        {belowFold.map((university) => (
          <PopularUniversityCard
            key={university.id}
            university={university}
            priority={false}
            loading="lazy"
            fetchPriority="low"
            quality={50} // 동적 로딩 이미지는 50으로 최대 압축
          />
        ))}
      </div>
    </div>
  );
};

export default PopularUniversitySection;
