"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { ListUniversity } from "@/types/university";

type HomeCollegeCardsProps = {
  colleges: ListUniversity[];
};

const HomeCollegeCards = ({ colleges }: HomeCollegeCardsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheel = (e: WheelEvent) => {
    if (containerRef.current) {
      e.preventDefault();
      containerRef.current.scrollLeft += e.deltaY;
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel as unknown as EventListener, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel as unknown as EventListener);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="overflow-x-auto">
      <div className="flex gap-2">
        {colleges.map((college) => (
          <HomeCollegeCard
            key={college.id}
            id={college.id}
            imageUrl={college.backgroundImageUrl || ""}
            name={college.koreanName || "대학명"}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeCollegeCards;

type HomeCollegeCardProps = {
  id: number;
  imageUrl: string;
  name: string;
};

const HomeCollegeCard = ({ id, imageUrl, name }: HomeCollegeCardProps) => (
  <Link href={`/university/${id}`}>
    <div className="relative w-[153px]">
      <div className="relative w-[153px]">
        <div className="absolute inset-0 h-[120px] rounded-lg bg-gradient-to-b from-transparent via-black/35 to-black/70" />
        <Image
          className="h-[120px] rounded-lg object-cover"
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${imageUrl}`}
          width={153}
          height={120}
          alt={name || "대학 없음"}
        />
      </div>
      <div className="absolute bottom-[9px] left-[10px] z-10 text-sm font-semibold leading-[160%] tracking-[0.15px] text-white">
        {name}
      </div>
    </div>
  </Link>
);
