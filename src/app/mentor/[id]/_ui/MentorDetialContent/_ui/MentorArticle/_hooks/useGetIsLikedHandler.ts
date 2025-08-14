import { useEffect, useState } from "react";

import useDeleteArticleLike from "@/api/news/client/useDeleteArticleLike";
import useGetArticleIsLiked from "@/api/news/client/useGetArticleIsLiked";
import usePostArticleLike from "@/api/news/client/usePostArticleLike";

const useGetIsLikedHandler = (articleId: number) => {
  const { data: isLikeData } = useGetArticleIsLiked(articleId);
  const { mutate: postArticleLike } = usePostArticleLike();
  const { mutate: deleteArticleLike } = useDeleteArticleLike();
  const [isLiked, setIsLiked] = useState<boolean>(false);

  useEffect(() => {
    if (isLikeData) {
      setIsLiked(isLikeData);
    }
  }, [isLikeData]);

  const handleToggleLike = () => {
    setIsLiked((prev) => !prev);
    if (!isLiked) {
      postArticleLike(articleId);
    } else {
      deleteArticleLike(articleId);
    }
  };

  return {
    isLiked,
    handleToggleLike,
  };
};
export default useGetIsLikedHandler;
