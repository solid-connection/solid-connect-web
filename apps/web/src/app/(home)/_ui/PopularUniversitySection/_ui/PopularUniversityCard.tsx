import Link from "next/link";
import Image from "@/components/ui/FallbackImage";
import { getHomeUniversitySlugByName } from "@/constants/university";
import type { ListUniversity } from "@/types/university";
import { convertImageUrl } from "@/utils/fileUtils";

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
  const homeUniversitySlug = getHomeUniversitySlugByName(university.homeUniversityName);
  const universityDetailHref = homeUniversitySlug
    ? `/university/${homeUniversitySlug}/${university.id}`
    : "/university";

  return (
    <Link key={university.id} href={universityDetailHref}>
      <div className="relative w-[153px]">
        <div className="relative h-[120px] w-[153px] overflow-hidden rounded-lg bg-k-700">
          <Image
            className="h-[120px] rounded-lg object-cover"
            src={
              university.backgroundImageUrl
                ? convertImageUrl(university.backgroundImageUrl)
                : "/svgs/placeholders/university-background-placeholder.svg"
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
            fallbackSrc="/svgs/placeholders/university-background-placeholder.svg"
          />
        </div>
        <div className="absolute bottom-[9px] left-[10px] z-10 tracking-[0.15px] text-white typo-sb-9">
          {university.koreanName}
        </div>
      </div>
    </Link>
  );
};

export default PopularUniversityCard;
