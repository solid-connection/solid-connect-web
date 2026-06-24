import Image from "@/components/ui/FallbackImage";
import UniversityZoneLink from "@/components/ui/UniversityZoneLink";
import { getHomeUniversitySlugByName } from "@/constants/university";
import type { ListUniversity } from "@/types/university";
import { normalizeImageUrlToUploadCdn } from "@/utils/cdnUrl";

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

  if (!homeUniversitySlug) {
    return null;
  }

  const universityDetailHref = `/university/${homeUniversitySlug}/${university.id}`;

  return (
    <UniversityZoneLink key={university.id} href={universityDetailHref} className="block md:min-w-0">
      <div className="relative w-[153px] md:w-full">
        <div className="relative h-[120px] w-[153px] overflow-hidden rounded-lg bg-k-700 md:h-40 md:w-full">
          <Image
            className="h-[120px] rounded-lg object-cover md:h-40 md:w-full"
            src={
              university.backgroundImageUrl
                ? normalizeImageUrlToUploadCdn(university.backgroundImageUrl)
                : "/svgs/placeholders/university-background-placeholder.svg"
            }
            width={153}
            height={120}
            alt={`${university.koreanName || "대학교"} 배경 이미지`}
            priority={priority}
            loading={loading}
            fetchPriority={fetchPriority}
            sizes="(max-width: 600px) 153px, (max-width: 1280px) 25vw, 16vw"
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
        <div className="absolute bottom-[9px] left-[10px] right-2 z-10 truncate tracking-[0.15px] text-white typo-sb-9">
          {university.koreanName}
        </div>
      </div>
    </UniversityZoneLink>
  );
};

export default PopularUniversityCard;
