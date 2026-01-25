import { useCallback } from "react";
import { useDeleteArticle } from "@/apis/news";
import { ArticleDropdownType } from "@/types/news";

interface UseDeleteDropDownHandlerProps {
  articleId: number;
  setIsArticleModalOpen: (isOpen: boolean) => void;
  userId?: number;
}
interface UseDeleteDropDownHandlerReturn {
  handleDropdownSelect: (value: ArticleDropdownType) => void;
}

const useDeleteDropDownHandler = ({
  articleId,
  setIsArticleModalOpen,
  userId,
}: UseDeleteDropDownHandlerProps): UseDeleteDropDownHandlerReturn => {
  const { mutate: deleteArticle } = useDeleteArticle(userId ?? null);

  const handleDropdownSelect = useCallback(
    (value: ArticleDropdownType) => {
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
