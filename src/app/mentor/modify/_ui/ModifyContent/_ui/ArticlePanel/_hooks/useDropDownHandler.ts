import { useCallback } from "react";

import { ArticleDropdownType } from "@/types/news";

import useDeleteArticle from "@/api/news/client/useDeleteArticle";

interface UseDeleteDropDownHandlerProps {
  articleId: number;
  setIsArticleModalOpen: (isOpen: boolean) => void;
}
interface UseDeleteDropDownHandlerReturn {
  handleDropdownSelect: (value: ArticleDropdownType) => void;
}

const useDeleteDropDownHandler = ({
  articleId,
  setIsArticleModalOpen,
}: UseDeleteDropDownHandlerProps): UseDeleteDropDownHandlerReturn => {
  const { mutate: deleteArticle } = useDeleteArticle();

  const handleDropdownSelect = useCallback(
    (value: ArticleDropdownType) => {
      console.log("handleDropdownSelect called with:", value);
      switch (value) {
        case ArticleDropdownType.EDIT:
          setIsArticleModalOpen(true);
          break;
        case ArticleDropdownType.DELETE:
          if (!confirm("정말로 이 아티클을 삭제하시겠습니까?")) return;
          deleteArticle(articleId);
          break;
        default:
          break;
      }
    },
    [articleId, deleteArticle, setIsArticleModalOpen],
  );
  return {
    handleDropdownSelect,
  };
};
export default useDeleteDropDownHandler;
