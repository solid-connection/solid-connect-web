import Image from "next/image";
import Link from "next/link";

import { convertImageUrl } from "@/utils/fileUtils";

import { ListUniversity } from "@/types/university";

type PopularUniversityCardProps = {
  university: ListUniversity;
  priority?: boolean;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low";
  quality?: number;
};

const PopularUniversityCard = ({
  university,
  priority = false,
  loading = "lazy",
  fetchPriority = "low",
  quality = 60, // 기본값을 60으로 낮춤
}: PopularUniversityCardProps) => {
  return (
    <Link key={university.id} href={`/university/${university.id}`}>
      <div className="relative w-[153px]">
        <div className="relative h-[120px] w-[153px] overflow-hidden rounded-lg bg-gray-200">
          <Image
            className="h-[120px] rounded-lg object-cover"
            src={
              university.backgroundImageUrl
                ? convertImageUrl(university.backgroundImageUrl)
                : "/images/default-university.jpg"
            }
            width={153}
            height={120}
            alt={`${university.koreanName || "대학교"} 배경 이미지`}
            priority={priority}
            loading={loading}
            fetchPriority={fetchPriority}
            sizes="(max-width: 600px) 100vw, (max-width: 768px) 50vw, 153px"
            quality={quality}
            placeholder={!priority ? "blur" : undefined}
            blurDataURL={
              !priority
                ? "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                : undefined
            }
          />
        </div>
        <div className="absolute bottom-[9px] left-[10px] z-10 text-sm font-semibold leading-[160%] tracking-[0.15px] text-white">
          {university.koreanName}
        </div>
      </div>
    </Link>
  );
};

export default PopularUniversityCard;
