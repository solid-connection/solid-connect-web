import Image from "next/image";
import { useState } from "react";

import { convertISODateToDate } from "@/utils/datetimeUtils";

import ArticleBottomSheetModal from "@/components/mentor/ArticleBottomSheetModal";
import ReusableDropdown from "@/components/ui/ReusableDropdown";

import useDeleteDropDownHandler from "./_hooks/useDropDownHandler";

import { ArticleDropdownType } from "@/types/news";
import { Article } from "@/types/news";

import { IconPencil } from "@/public/svgs/mentor";

interface ArticlePanelProps {
  article: Article;
}

const dropdownOptions: ArticleDropdownType[] = [ArticleDropdownType.EDIT, ArticleDropdownType.DELETE];

const NEXT_PUBLIC_IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

const ArticlePanel = ({ article }: ArticlePanelProps) => {
  // state
  const [isArticleModalOpen, setIsArticleModalOpen] = useState<boolean>(false);
  const { handleDropdownSelect } = useDeleteDropDownHandler({
    articleId: 0,
    setIsArticleModalOpen,
  });

  console.log("article", article);
  return (
    <>
      <div className="relative h-[200px] w-full">
        <Image
          src={`${NEXT_PUBLIC_IMAGE_URL}/${article.thumbnailUrl}`}
          alt="멘토 아티클 이미지"
          fill
          className="object-cover"
        />
      </div>
      <div className="mt-[10px] flex justify-between">
        <div className="text-[13px] font-medium text-k-500">{convertISODateToDate(article.updatedAt)}</div>
        <div className="relative">
          <ReusableDropdown<ArticleDropdownType> items={dropdownOptions} onSelect={handleDropdownSelect}>
            <button type="button" className="h-5 w-5 rounded-full bg-secondary-500 px-1 py-1">
              <IconPencil />
            </button>
          </ReusableDropdown>
        </div>
      </div>
      <h2 className="mt-[6px] text-[17px] font-semibold leading-normal text-k-800">{article.title}</h2>
      <p className="text-sm font-normal text-k-500">{article.description}</p>

      <ArticleBottomSheetModal
        isOpen={isArticleModalOpen}
        mode="수정하기"
        handleClose={() => {
          setIsArticleModalOpen(false);
        }}
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
