import dynamic from "next/dynamic";
import { Suspense } from "react";

import PopularUniversityCard from "./_ui/PopularUniversityCard";

import { ListUniversity } from "@/types/university";

// PopularUniversityCard를 동적 임포트
const PopularUniversityCardDynamic = dynamic(() => import("./_ui/PopularUniversityCard"), {
  ssr: false,
  loading: () => (
    <div className="relative w-[153px]">
      <div className="h-[120px] w-[153px] animate-pulse rounded-lg bg-gray-200" />
    </div>
  ),
});

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

        {/* 나머지는 동적 렌더링으로 위임 */}
        {belowFold.map((university) => (
          <Suspense
            key={university.id}
            fallback={
              <div className="relative w-[153px]">
                <div className="h-[120px] w-[153px] animate-pulse rounded-lg bg-gray-200" />
              </div>
            }
          >
            <PopularUniversityCardDynamic
              university={university}
              priority={false}
              loading="lazy"
              fetchPriority="low"
              quality={50} // 동적 로딩 이미지는 50으로 최대 압축
            />
          </Suspense>
        ))}
      </div>
    </div>
  );
};

export default PopularUniversitySection;
