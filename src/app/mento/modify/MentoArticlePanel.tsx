import { useState } from "react";

import TextModal from "../../../components/modal/TextModal";

import { IconPlus } from "@/public/svgs/mentor";

const MentoArticlePanel = () => {
  // state
  const [isArticleModalOpen, setIsArticleModalOpen] = useState<boolean>(false);

  return (
    <>
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
            예시 아티클 보기
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
