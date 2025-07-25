import Image from "next/image";
import { useState } from "react";

import ArticleModal from "@/components/mentor/ArticleModal";
import ReusableDropdown from "@/components/ui/ReusableDropdown";

import { ArticleDropdownType } from "@/types/mentor";

import { ArticleResponse } from "@/api/article/type/response";
import { IconPencil } from "@/public/svgs/mentor";

interface ArticlePanelProps {
  article: ArticleResponse;
}

const dropdownOptions: ArticleDropdownType[] = [ArticleDropdownType.EDIT, ArticleDropdownType.DELETE];

const ArticlePanel = ({ article }: ArticlePanelProps) => {
  // state
  const [isArticleModalOpen, setIsArticleModalOpen] = useState<boolean>(false);

  const handleDropdownSelect = (value: ArticleDropdownType) => {
    switch (value) {
      case ArticleDropdownType.EDIT:
        setIsArticleModalOpen(true);
        break;
      case ArticleDropdownType.DELETE:
        // 삭제 로직
        break;
      default:
        break;
    }
  };

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

      <ArticleModal
        isOpen={isArticleModalOpen}
        handleClose={() => setIsArticleModalOpen(false)}
        initialData={{
          title: article.title,
          content: article.description,
        }}
        onSubmit={(data) => {
          console.log("아티클 수정:", data);
          // 여기서 아티클 수정 로직 처리
        }}
      />
    </>
  );
};

export default ArticlePanel;
