import { AxiosError, AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { ArticleFormData } from "@/components/mentor/ArticleBottomSheetModal/lib/schema";

import { QueryKeys } from "./queryKey";

import { Article } from "@/types/news";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/zustand/useToastStore";

type UsePutModifyArticleRequest = {
  body: ArticleFormData & { isImageDeleted?: boolean };
  articleId: number;
};
type ArticleMutationContext = {
  previousArticleList?: Article[];
};

const putModifyArticle = async (props: UsePutModifyArticleRequest): Promise<Article> => {
  const { body, articleId } = props;
  const newsUpdateRequest = {
    title: body.title,
    description: body.description,
    url: body.url || "",
    resetToDefaultImage: body.isImageDeleted === true,
  };
  const formData = new FormData();
  formData.append("newsUpdateRequest", new Blob([JSON.stringify(newsUpdateRequest)], { type: "application/json" }));
  if (body.file) formData.append("file", body.file);

  const response: AxiosResponse<Article> = await axiosInstance.put(`/news/${articleId}`, formData);
  return response.data;
};

const usePutModifyArticle = (userId: number | null) => {
  const queryClient = useQueryClient();
  const queryKey = [QueryKeys.articleList, userId];

  return useMutation<Article, AxiosError<{ message: string }>, UsePutModifyArticleRequest, ArticleMutationContext>({
    mutationFn: putModifyArticle,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });
      const previousArticleList = queryClient.getQueryData<Article[]>(queryKey);

      queryClient.setQueryData<{ newsResponseList: Article[] }>(queryKey, (oldData) => {
        if (!oldData) return { newsResponseList: [] };

        return {
          newsResponseList: oldData.newsResponseList.map((article) => {
            if (article.id === variables.articleId) {
              const optimisticData = variables.body;

              return {
                ...article,
                title: optimisticData.title,
                description: optimisticData.description,
                url: optimisticData.url || "",
                thumbnailUrl: optimisticData.file ? URL.createObjectURL(optimisticData.file) : article.thumbnailUrl,
              };
            }
            return article;
          }),
        };
      });
      return { previousArticleList };
    },
    onError: (error, variables, context) => {
      console.log();
      const errorMessage = error.response?.data?.message || "";
      if (context?.previousArticleList) {
        queryClient.setQueryData(queryKey, context.previousArticleList);
      }
      toast.error("아티클 수정에 실패했습니다." + errorMessage);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

export default usePutModifyArticle;
