import Image from "next/image";
import Link from "next/link";

import { ListUniversity } from "@/types/university";

type PopularUniversityCardProps = {
  university: ListUniversity;
  priority?: boolean;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low";
};

const PopularUniversityCard = ({
  university,
  priority = false,
  loading = "lazy",
  fetchPriority = "low",
}: PopularUniversityCardProps) => {
  return (
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
            priority={priority}
            loading={loading}
            fetchPriority={fetchPriority}
            sizes="153px"
            placeholder={!priority ? "blur" : undefined}
            blurDataURL={
              !priority
                ? "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                : undefined
            }
            unoptimized={false}
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
