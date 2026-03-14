"use client";

import { useEffect, useState } from "react";
import { useDeleteArticleLike, usePostArticleLike } from "@/apis/news";
import Image from "@/components/ui/FallbackImage";
import { IconLikeFill, IconLikeNotFill } from "@/public/svgs/mentor";
import type { Article } from "@/types/news";
import { convertUploadedImageUrl } from "@/utils/fileUtils";

interface MentorArticleProps {
  article: Article;
  mentorId: number;
}

const MentorArticle = ({ article, mentorId }: MentorArticleProps) => {
  const { mutate: postArticleLike } = usePostArticleLike(mentorId);
  const { mutate: deleteArticleLike } = useDeleteArticleLike(mentorId);
  const [isLiked, setIsLiked] = useState<boolean>(article.isLiked ?? false);

  const handleToggleLike = () => {
    if (!isLiked) {
      postArticleLike(article.id);
    } else {
      deleteArticleLike(article.id);
    }
  };

  useEffect(() => {
    if (article.isLiked !== undefined) {
      setIsLiked(article.isLiked);
    }
  }, [article.isLiked]);

  const thumbnailUrl = convertUploadedImageUrl(article.thumbnailUrl);
  return (
    <div key={article.description} className="overflow-hidden">
      {/* 아티클 이미지 */}
      <div className="relative mb-2 h-48 w-full rounded-lg bg-gradient-to-br from-blue-400 to-blue-600">
        <Image src={thumbnailUrl} alt={article.title} fill className="object-cover" />
      </div>

      {/* 아티클 내용 */}

      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-k-800 typo-sb-7">{article.title}</h3>
        <button className="h-5 w-5" onClick={handleToggleLike}>
          {isLiked ? <IconLikeFill /> : <IconLikeNotFill />}
        </button>
      </div>
      <p className="text-k-500 typo-regular-2">{article.description}</p>
    </div>
  );
};
export default MentorArticle;
