"use client";

import Image from "next/image";
import Link from "next/link";

import type { HomeUniversityInfo } from "@/constants/university";

interface HomeUniversityCardProps {
  university: HomeUniversityInfo;
}

const HomeUniversityCard = ({ university }: HomeUniversityCardProps) => {
  return (
    <Link
      href={`/university/${university.slug}`}
      className="group flex items-center gap-5 rounded-2xl border border-k-100 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-lg"
    >
      <div
        className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-k-50"
        style={{ backgroundColor: `${university.color}10` }}
      >
        <Image
          src={university.logoUrl}
          alt={`${university.name} 로고`}
          width={48}
          height={48}
          className="h-12 w-12 object-contain"
          onError={(e) => {
            // 이미지 로드 실패 시 기본 텍스트 표시
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
          }}
        />
      </div>

      <div className="flex flex-1 flex-col">
        <span className="text-k-800 typo-bold-3 group-hover:text-primary">{university.name}</span>
        <span className="text-k-500 typo-medium-4">{university.description}</span>
      </div>

      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-k-50 transition-colors group-hover:bg-primary-100">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-k-400 group-hover:text-primary"
        >
          <path
            d="M6 12L10 8L6 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </Link>
  );
};

export default HomeUniversityCard;
