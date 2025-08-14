import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteArticle = async (articleId: number): Promise<void> => {
  const response: AxiosResponse<void> = await axiosInstance.delete(`/news/${articleId}`);
  return response.data;
};

const useDeleteArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      // 아티클 목록 쿼리를 무효화하여 새로 고침
      queryClient.invalidateQueries({ queryKey: [QueryKeys.articleList] });
    },
    onError: (error) => {
      alert("아티클 삭제에 실패했습니다. 다시 시도해주세요.");
      console.error("Failed to delete article:", error);
    },
  });
};

export default useDeleteArticle;
