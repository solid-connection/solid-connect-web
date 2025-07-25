import Image from "next/image";
import { useState } from "react";

import ArticleModal from "@/components/mentor/ArticleModal";
import ReusableDropdown from "@/components/ui/ReusableDropdown";
import ToolTipMessage from "@/components/ui/TooltipMessage";

import { ArticleDropdownType } from "@/types/mentor";

import { IconPencil, IconPlus } from "@/public/svgs/mentor";

interface ArticleData {
  id: string;
  imageUrl: string;
  date: string;
  title: string;
  description: string;
}

interface ArticlePanelProps {
  articleData?: ArticleData;
}

const dropdownOptions: ArticleDropdownType[] = [ArticleDropdownType.EDIT, ArticleDropdownType.DELETE];

const ArticlePanel = ({ articleData }: ArticlePanelProps) => {
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

  // articleData가 없으면 새 아티클 추가 UI 렌더링
  if (!articleData) {
    return (
      <>
        <div className="relative mt-10 flex h-[160px] flex-col items-center justify-center bg-k-50">
          <div className="flex w-full flex-1 items-center justify-center">
            <button
              type="button"
              onClick={() => setIsArticleModalOpen(true)}
              className="relative flex h-[39px] w-2/3 items-center justify-center gap-2 rounded-lg bg-k-100 text-sm font-medium text-k-500"
            >
              <span className="flex h-[14px] w-[14px] items-center justify-center rounded-full bg-k-500 text-lg">
                <div className="h-[10px] w-[10px]">
                  <IconPlus />
                </div>
              </span>
              새로운 아티클 추가하기
            </button>
          </div>

          {/* 툴팁을 IconPlus 위치에 맞춰 배치 */}
          <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 transform">
            <ToolTipMessage bgColor="secondary" message="아티클을 추가해서 내 채널 유입률을 높여보세요!" />
          </div>
        </div>

        <ArticleModal
          isOpen={isArticleModalOpen}
          handleClose={() => setIsArticleModalOpen(false)}
          onSubmit={(data) => {
            console.log("새 아티클:", data);
            // 여기서 아티클 추가 로직 처리
          }}
        />
      </>
    );
  }

  return (
    <>
      <div className="relative h-[200px] w-full">
        <Image src={articleData.imageUrl} alt="멘토 아티클 이미지" fill className="object-cover" />
      </div>
      <div className="mt-[10px] flex justify-between">
        <div className="text-[13px] font-medium text-k-500">{articleData.date}</div>
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
      <h2 className="mt-[6px] text-[17px] font-semibold leading-normal text-k-800">{articleData.title}</h2>
      <p className="text-sm font-normal text-k-500">{articleData.description}</p>

      <ArticleModal
        isOpen={isArticleModalOpen}
        handleClose={() => setIsArticleModalOpen(false)}
        initialData={{
          title: articleData.title,
          content: articleData.description,
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
