import { useState } from "react";

import { convertISODateToDate } from "@/utils/datetimeUtils";
import { convertUploadedImageUrl } from "@/utils/fileUtils";

import ArticleBottomSheetModal from "@/components/mentor/ArticleBottomSheetModal";
import OptimisticImg from "@/components/ui/OptimisticImg";
import ReusableDropdown from "@/components/ui/ReusableDropdown";

import useDeleteDropDownHandler from "./_hooks/useDropDownHandler";

import { ArticleDropdownType } from "@/types/news";
import { Article } from "@/types/news";

import ArticleThumbPng from "@/public/images/article-thumb.png";
import { IconPencil } from "@/public/svgs/mentor";

interface ArticlePanelProps {
  article: Article;
  userId?: number;
}

const dropdownOptions: ArticleDropdownType[] = [ArticleDropdownType.EDIT, ArticleDropdownType.DELETE];

const ArticlePanel = ({ article, userId }: ArticlePanelProps) => {
  // state
  const [isArticleModalOpen, setIsArticleModalOpen] = useState<boolean>(false);
  const { handleDropdownSelect } = useDeleteDropDownHandler({
    articleId: article.id,
    setIsArticleModalOpen,
    userId,
  });

  const imageSrc = article.thumbnailUrl ? convertUploadedImageUrl(article.thumbnailUrl) : ArticleThumbPng;

  return (
    <>
      <div className="relative h-[200px] w-full">
        <OptimisticImg src={imageSrc as string} alt="멘토 아티클 이미지" />
      </div>
      <div className="mt-[10px] flex justify-between">
        <div className="typo-medium-3 text-k-500">{convertISODateToDate(article.updatedAt)}</div>
        <div className="relative">
          <ReusableDropdown<ArticleDropdownType> items={dropdownOptions} onSelect={handleDropdownSelect}>
            <button type="button" className="h-5 w-5 rounded-full bg-secondary-500 px-1 py-1">
              <IconPencil />
            </button>
          </ReusableDropdown>
        </div>
      </div>
      <h2 className="mt-[6px] typo-sb-6 text-k-800">{article.title}</h2>
      <p className="typo-regular-2 text-k-500">{article.description}</p>

      <ArticleBottomSheetModal
        isOpen={isArticleModalOpen}
        mode="수정하기"
        handleClose={() => {
          setIsArticleModalOpen(false);
        }}
        articleId={article.id}
        initialData={{
          title: article.title,
          description: article.description,
          url: article.url,
          thumbnailUrl: article.thumbnailUrl,
        }}
      />
    </>
  );
};

export default ArticlePanel;
