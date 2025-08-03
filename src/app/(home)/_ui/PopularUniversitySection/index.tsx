import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { ListUniversity } from "@/types/university";

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
          <Link key={university.id} href={`/university/${university.id}`}>
            <div className="relative w-[153px]">
              <div className="relative h-[120px] w-[153px] overflow-hidden rounded-lg bg-gray-200">
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
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "low"}
                  sizes="153px"
                  unoptimized={false}
                />
              </div>
              <div className="absolute bottom-[9px] left-[10px] z-10 text-sm font-semibold leading-[160%] tracking-[0.15px] text-white">
                {university.koreanName}
              </div>
            </div>
          </Link>
        ))}

        {/* 나머지는 뒤늦게 HTML 스트림으로 전송 */}
        {belowFold.length > 0 && (
          <Suspense fallback={null}>
            <PopularUniversitiesBelowFold universities={belowFold} />
          </Suspense>
        )}
      </div>
    </div>
  );
};

const PopularUniversitiesBelowFold = ({ universities }: { universities: ListUniversity[] }) => {
  return (
    <>
      {universities.map((university) => (
        <Link key={university.id} href={`/university/${university.id}`}>
          <div className="relative w-[153px]">
            <div className="relative h-[120px] w-[153px] overflow-hidden rounded-lg bg-gray-200">
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
                priority={false}
                loading="lazy"
                fetchPriority="low"
                sizes="153px"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                unoptimized={false}
              />
            </div>
            <div className="absolute bottom-[9px] left-[10px] z-10 text-sm font-semibold leading-[160%] tracking-[0.15px] text-white">
              {university.koreanName}
            </div>
          </div>
        </Link>
      ))}
    </>
  );
};

export default PopularUniversitySection;
