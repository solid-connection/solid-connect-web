"use client";

import Image from "next/image";
import { useState } from "react";

import { Article } from "@/types/mentor";

import { IconLikeFill, IconLkieNotFill } from "@/public/svgs/mentor";

interface MentorArticleProps {
  article: Article;
}

const MentorArticle = ({ article }: MentorArticleProps) => {
  const [isLiked, setIsLiked] = useState<boolean>(article.isLiked);

  return (
    <div key={article.id} className="overflow-hidden">
      {/* 아티클 이미지 */}
      <div className="relative mb-2 h-48 w-full rounded-lg bg-gradient-to-br from-blue-400 to-blue-600">
        <Image src={article.imageUrl} alt={article.title} fill className="object-cover" />
      </div>

      {/* 아티클 내용 */}

      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-base font-semibold text-k-800">{article.title}</h3>
        <button className="h-5 w-5" onClick={() => setIsLiked(!isLiked)}>
          {isLiked ? <IconLikeFill /> : <IconLkieNotFill />}
        </button>
      </div>
      <p className="text-sm text-k-500">{article.description}</p>
    </div>
  );
};
export default MentorArticle;
