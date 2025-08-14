import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { ArticleFormData } from "@/components/mentor/ArticleModal/lib/schema";

import { QueryKeys } from "./queryKey";

import { useMutation, useQueryClient } from "@tanstack/react-query";

type UsePostAddArticleRequest = ArticleFormData;

interface UsePostAddArticleResponse {
  id: number;
}

const postAddArticle = async (body: UsePostAddArticleRequest): Promise<UsePostAddArticleResponse> => {
  const newsCreateRequest = {
    title: body.title,
    description: body.description,
    url: body.url || "",
  };

  // 파일이 있는 경우 FormData로 전송, 없는 경우 JSON으로 전송
  if (body.file) {
    const formData = new FormData();
    formData.append("newsCreateRequest", new Blob([JSON.stringify(newsCreateRequest)], { type: "application/json" }));
    formData.append("file", body.file);

    const response: AxiosResponse<UsePostAddArticleResponse> = await axiosInstance.post("/news", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } else {
    const response: AxiosResponse<UsePostAddArticleResponse> = await axiosInstance.post("/news", newsCreateRequest);
    return response.data;
  }
};

const usePostAddArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postAddArticle,
    onSuccess: () => {
      // 아티클 목록 쿼리를 무효화하여 새로 고침
      queryClient.invalidateQueries({ queryKey: [QueryKeys.articleList] });
    },
    onError: () => {
      alert("아티클 추가에 실패했습니다. 다시 시도해주세요.");
    },
  });
};

export default usePostAddArticle;
