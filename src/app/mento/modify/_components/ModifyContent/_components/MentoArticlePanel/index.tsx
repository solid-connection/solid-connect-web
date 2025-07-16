import Image from "next/image";
import { useState } from "react";

import TextModal from "@/components/modal/TextModal";
import ReusableDropdown from "@/components/ui/ReusableDropdown";

import { IconPencil, IconPlus } from "@/public/svgs/mentor";

const MentoArticlePanel = () => {
  // state
  const [isArticleModalOpen, setIsArticleModalOpen] = useState<boolean>(false);

  const dropdownOptions = [
    { id: "edit", label: "수정하기", value: "edit" },
    { id: "delete", label: "삭제하기", value: "delete" },
  ];

  const handleDropdownSelect = (value: string) => {
    console.log("Selected:", value);
    // 여기서 수정/삭제 로직 처리
  };

  return (
    <>
      <div className="relative h-[200px] w-full">
        <Image src="/images/article-thumb.png" alt="멘토 아티클 이미지" fill className="object-cover" />
      </div>
      <div className="mt-[10px] flex justify-between">
        <div className="text-[13px] font-medium text-k-500">{2020 - 10 - 23}</div>
        <div className="relative">
          <ReusableDropdown items={dropdownOptions} selectedValue="" onSelect={handleDropdownSelect}>
            <button className="h-5 w-5 rounded-full bg-secondary-500 px-1 py-1">
              <IconPencil />
            </button>
          </ReusableDropdown>
        </div>
      </div>
      <h2 className="mt-[6px] text-[17px] font-semibold leading-normal text-k-800">교환학생 찐 후기</h2>
      <p className="text-sm font-normal text-k-500">
        교환학생 경험의 진솔한 이야기와 꿀팁이 가득한 &apos;찐&apos; 후기를 영상에서 확인하세요!
      </p>
      <div className="mt-[10px] flex h-[160px] flex-col items-center justify-center bg-k-50">
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
      </div>

      <TextModal
        isOpen={isArticleModalOpen}
        handleClose={() => setIsArticleModalOpen(false)}
        title="예시 아티클"
        content="예시 아티클입니다"
      />
    </>
  );
};

export default MentoArticlePanel;
