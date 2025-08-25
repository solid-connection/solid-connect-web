import { AxiosError, AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";
import { convertUploadedImageUrl } from "@/utils/fileUtils";

import { ArticleFormData } from "@/components/mentor/ArticleBottomSheetModal/lib/schema";

import { QueryKeys } from "./queryKey";

import { Article } from "@/types/news";

import ArticleThumbUrlPng from "@/public/images/article-thumb.png";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ArticleMutationContext = {
  previousArticleList?: Article[];
};

type UsePostAddArticleRequest = ArticleFormData;

const postAddArticle = async (body: UsePostAddArticleRequest): Promise<Article> => {
  const newsCreateRequest = {
    title: body.title,
    description: body.description,
    url: body.url || "",
  };

  const formData = new FormData();
  formData.append("newsCreateRequest", new Blob([JSON.stringify(newsCreateRequest)], { type: "application/json" }));
  if (body.file) {
    formData.append("file", body.file);
  }
  const response: AxiosResponse<Article> = await axiosInstance.post("/news", formData);
  return response.data;
};

const usePostAddArticle = (userId: number | null) => {
  const queryClient = useQueryClient();
  const queryKey = [QueryKeys.articleList, userId];

  return useMutation<Article, AxiosError<{ message: string }>, UsePostAddArticleRequest, ArticleMutationContext>({
    mutationFn: postAddArticle,
    onMutate: async (newArticle) => {
      await queryClient.cancelQueries({ queryKey });

      const previousArticleList = queryClient.getQueryData<Article[]>(queryKey);

      queryClient.setQueryData<{ newsResponseList: Article[] }>(queryKey, (oldData) => {
        if (!oldData) return { newsResponseList: [] };

        const optimisticArticle: Article = {
          id: Date.now(), // 임시 ID
          title: newArticle.title,
          description: newArticle.description,
          url: newArticle.url || "",
          thumbnailUrl: newArticle.file ? URL.createObjectURL(newArticle.file) : ArticleThumbUrlPng.src,
          updatedAt: new Date().toISOString(),
        };

        return {
          newsResponseList: [optimisticArticle, ...oldData.newsResponseList],
        };
      });
      return { previousArticleList };
    },
    onError: (error, variables, context) => {
      const errorMessage = error.response?.data?.message || "";
      if (context?.previousArticleList) {
        queryClient.setQueryData(queryKey, context.previousArticleList);
      }
      alert("아티클 추가에 실패했습니다: " + errorMessage);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

export default usePostAddArticle;
