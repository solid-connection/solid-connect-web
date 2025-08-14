import Image from "next/image";
import { useState } from "react";

import ArticleBottomSheetModal from "@/components/mentor/ArticleBottomSheetModal";
import ReusableDropdown from "@/components/ui/ReusableDropdown";

import useDeleteDropDownHandler from "./_hooks/useDropDownHandler";

import { ArticleDropdownType } from "@/types/news";
import { Article } from "@/types/news";

import usePutModifyArticle from "@/api/news/client/usePutModifyArticle";
import { IconPencil } from "@/public/svgs/mentor";

interface ArticlePanelProps {
  article: Article;
}

const dropdownOptions: ArticleDropdownType[] = [ArticleDropdownType.EDIT, ArticleDropdownType.DELETE];

const ArticlePanel = ({ article }: ArticlePanelProps) => {
  // state
  const [isArticleModalOpen, setIsArticleModalOpen] = useState<boolean>(false);
  const { mutate: putModifyArticle } = usePutModifyArticle();
  const { handleDropdownSelect } = useDeleteDropDownHandler({
    articleId: 0,
    setIsArticleModalOpen,
  });

  return (
    <>
      <div className="relative h-[200px] w-full">
        <Image src={article.thumbnailUrl} alt="멘토 아티클 이미지" fill className="object-cover" />
      </div>
      <div className="mt-[10px] flex justify-between">
        <div className="text-[13px] font-medium text-k-500">{article.updatedAt}</div>
        <div className="relative">
          <ReusableDropdown<ArticleDropdownType>
            items={dropdownOptions}
            selectedValue={"" as ArticleDropdownType}
            onSelect={handleDropdownSelect}
          >
            <button className="h-5 w-5 rounded-full bg-secondary-500 px-1 py-1">
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
        }}
        onSubmit={(data) => {
          putModifyArticle(data);
          // 여기서 아티클 수정 로직 처리
        }}
      />
    </>
  );
};

export default ArticlePanel;
