"use client";

import Image from "next/image";
import Link from "next/link";

import useWheelHandler from "./_hooks/useWheelHandler";

import { ListUniversity } from "@/types/university";

type PopularCollegeSectionProps = {
  colleges: ListUniversity[];
};

const PopularCollegeSection = ({ colleges }: PopularCollegeSectionProps) => {
  const { containerRef } = useWheelHandler();

  return (
    <div ref={containerRef} className="overflow-x-auto">
      <div className="flex gap-2">
        {colleges.map((college) => (
          <Link key={college.id} href={`/university/${college.id}`}>
            <div className="relative w-[153px]">
              <div className="relative w-[153px]">
                <div className="absolute inset-0 h-[120px] rounded-lg bg-gradient-to-b from-transparent via-black/35 to-black/70" />
                <Image
                  className="h-[120px] rounded-lg object-cover"
                  src={
                    college.backgroundImageUrl
                      ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${college.backgroundImageUrl}`
                      : "/images/default-university.jpg"
                  }
                  width={153}
                  height={120}
                  alt={`${college.koreanName || "대학교"} 배경 이미지`}
                />
              </div>
              <div className="absolute bottom-[9px] left-[10px] z-10 text-sm font-semibold leading-[160%] tracking-[0.15px] text-white">
                {college.koreanName}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PopularCollegeSection;
