"use client";

import Link from "next/link";
import Image from "@/components/ui/FallbackImage";
import { IconLoveLetter } from "@/public/svgs/home";
import type { News } from "@/types/news";
import useSectionHandler from "./_hooks/useSectionHadnler";

export type NewsSectionProps = {
  newsList: News[];
};

const NewsSection = ({ newsList }: NewsSectionProps) => {
  const { sectionRef, visible } = useSectionHandler();

  return (
    <div ref={sectionRef} className="mt-6 pl-5">
      <div className="mb-2.5 flex items-center gap-1.5 font-serif text-k-700 typo-sb-7">
        솔커에서 맛보는 소식
        <IconLoveLetter />
        {/* <Link href="/news" className="ml-auto typo-regular-2 text-k-500">
          더보기
          <span className="ml-1 inline-block">
            <IconDirectionRight />
          </span>
        </Link> */}
      </div>
      {!visible ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="flex animate-pulse gap-4">
              <div className="h-24 w-44 shrink-0 rounded-xl bg-gray-300" />
              <div className="mr-5 flex flex-col gap-2">
                <div className="h-5 w-32 rounded bg-gray-300" />
                <div className="h-4 w-40 rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {newsList.map((news) => (
            <Link key={news.id} target="_blank" href={news.url} rel="noreferrer">
              <div className="flex gap-4">
                <Image
                  loading="lazy"
                  className="h-24 w-44 shrink-0 rounded-xl object-cover"
                  src={news.imageUrl}
                  alt={news.title}
                  width={170}
                  height={90}
                />
                <div className="mr-5 flex flex-col gap-0.5">
                  <div className="text-serif text-k-700 typo-sb-9">{news.title}</div>
                  <div className="font-serif text-k-500 typo-regular-4">{news.description}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsSection;
