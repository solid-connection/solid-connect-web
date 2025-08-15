// ui/AddArticleCard/index.tsx
import { useState } from "react";

import ArticleBottomSheetModal from "@/components/mentor/ArticleBottomSheetModal";

import usePostAddArticle from "@/api/news/client/usePostAddArticle";
import { IconPlus } from "@/public/svgs/mentor";

const AddArticleCard = () => {
  const [open, setOpen] = useState(false);
  const { mutate: postAddArticle } = usePostAddArticle();
  return (
    <>
      <div className="relative mt-10 flex h-40 flex-col items-center justify-center bg-k-50">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-10 w-2/3 items-center justify-center gap-2 rounded-lg bg-k-100 text-sm font-medium text-k-500"
        >
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-k-500">
            <IconPlus className="h-2.5 w-2.5" />
          </span>
          새로운 아티클 추가하기
        </button>
      </div>
      <ArticleBottomSheetModal
        mode="추가하기"
        isOpen={open}
        handleClose={() => setOpen(false)}
        onSubmit={(data) => {
          postAddArticle(data);
        }}
      />
    </>
  );
};

export default AddArticleCard;
