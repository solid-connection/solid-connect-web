import { ArticleDropdownType } from "@/types/mentor";

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

  const handleDropdownSelect = (value: ArticleDropdownType) => {
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
  };
  return {
    handleDropdownSelect,
  };
};
export default useDeleteDropDownHandler;
