// ui/AddArticleCard/index.tsx
import { useState } from "react";

import ArticleBottomSheetModal from "@/components/mentor/ArticleBottomSheetModal";
import ToolTipMessage from "@/components/ui/TooltipMessage";

import { IconPlus } from "@/public/svgs/mentor";

const AddArticleCard = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="relative mt-10 flex h-40 flex-col items-center justify-center bg-k-50">
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-10 flex h-10 items-center justify-center gap-2 rounded-lg bg-k-100 px-4 typo-medium-2 text-k-500"
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-k-500">
              <IconPlus className="h-2.5 w-2.5" />
            </span>
            새로운 아티클 추가하기
          </button>
          <div className="flex w-2/3 items-center justify-center">
            <ToolTipMessage
              message="아티클을 추가해서 내 채널 유입률을 높여보세요!"
              bgColor="secondary"
              borderColor="secondary"
              textColor="white"
            />
          </div>
        </div>
      </div>

      <ArticleBottomSheetModal mode="추가하기" isOpen={open} handleClose={() => setOpen(false)} />
    </>
  );
};

export default AddArticleCard;
