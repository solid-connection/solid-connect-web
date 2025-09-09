import { useEffect, useState } from "react";

import useDeleteArticleLike from "@/api/news/client/useDeleteArticleLike";
import usePostArticleLike from "@/api/news/client/usePostArticleLike";

const useLikeToggle = (articleId: number, mentorId: number, articleIsLiked?: boolean) => {
  const { mutate: postArticleLike } = usePostArticleLike(mentorId);
  const { mutate: deleteArticleLike } = useDeleteArticleLike(mentorId);
  const [isLiked, setIsLiked] = useState<boolean>(articleIsLiked ?? false);

  const handleToggleLike = () => {
    if (!isLiked) {
      postArticleLike(articleId);
    } else {
      deleteArticleLike(articleId);
    }
  };
  useEffect(() => {
    if (articleIsLiked !== undefined) {
      setIsLiked(articleIsLiked);
    }
  }, [articleIsLiked]);

  return {
    isLiked,
    handleToggleLike,
  };
};
export default useLikeToggle;
