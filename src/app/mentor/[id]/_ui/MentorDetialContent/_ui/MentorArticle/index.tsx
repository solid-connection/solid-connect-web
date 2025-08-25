"use client";

import Image from "next/image";

import { convertUploadedImageUrl } from "@/utils/fileUtils";

import useLikeToggle from "./_hooks/useLikeToggle";

import { Article } from "@/types/news";

import { IconLikeFill, IconLikeNotFill } from "@/public/svgs/mentor";

interface MentorArticleProps {
  article: Article;
  mentorId: number;
}

const MentorArticle = ({ article, mentorId }: MentorArticleProps) => {
  const { isLiked, handleToggleLike } = useLikeToggle(article.id, mentorId, article.isLiked);
  const thumbnailUrl = convertUploadedImageUrl(article.thumbnailUrl);
  return (
    <div key={article.description} className="overflow-hidden">
      {/* 아티클 이미지 */}
      <div className="relative mb-2 h-48 w-full rounded-lg bg-gradient-to-br from-blue-400 to-blue-600">
        <Image src={thumbnailUrl} alt={article.title} fill className="object-cover" />
      </div>

      {/* 아티클 내용 */}

      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-base font-semibold text-k-800">{article.title}</h3>
        <button className="h-5 w-5" onClick={handleToggleLike}>
          {isLiked ? <IconLikeFill /> : <IconLikeNotFill />}
        </button>
      </div>
      <p className="text-sm text-k-500">{article.description}</p>
    </div>
  );
};
export default MentorArticle;
