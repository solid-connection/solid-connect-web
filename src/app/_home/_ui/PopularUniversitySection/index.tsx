import Image from "next/image";
import Link from "next/link";

import { ListUniversity } from "@/types/university";

type PopularUniversitySectionProps = {
  universities: ListUniversity[];
};

const PopularUniversitySection = ({ universities }: PopularUniversitySectionProps) => {
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-2">
        {universities.map((university, index) => (
          <Link key={university.id} href={`/university/${university.id}`}>
            <div className="relative w-[153px]">
              <div className="relative w-[153px]">
                <Image
                  className="h-[120px] rounded-lg object-cover"
                  src={
                    university.backgroundImageUrl
                      ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${university.backgroundImageUrl}`
                      : "/images/default-university.jpg"
                  }
                  width={153}
                  height={120}
                  alt={`${university.koreanName || "대학교"} 배경 이미지`}
                  priority={index < 3} // 상위 3개는 우선 로딩
                  loading={index >= 3 ? "lazy" : "eager"}
                  fetchPriority={index < 3 ? "high" : "auto"}
                />
              </div>
              <div className="absolute bottom-[9px] left-[10px] z-10 text-sm font-semibold leading-[160%] tracking-[0.15px] text-white">
                {university.koreanName}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PopularUniversitySection;
