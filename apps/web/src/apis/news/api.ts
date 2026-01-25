import type { AxiosResponse } from "axios";
import type { ArticleFormData } from "@/components/mentor/ArticleBottomSheetModal/lib/schema";
import type { Article } from "@/types/news";
import { axiosInstance } from "@/utils/axiosInstance";

// ====== Query Keys ======
export const NewsQueryKeys = {
  articleList: "articleList",
  postAddArticle: "postAddArticle",
  putModifyArticle: "putModifyArticle",
} as const;

// ====== Types ======
export interface ArticleListResponse {
  newsResponseList: Article[];
}

export interface PostArticleLikeResponse {
  isLiked: boolean;
  likeCount: number;
}

export interface DeleteArticleLikeResponse {
  isLiked: boolean;
  likeCount: number;
}

export type UsePostAddArticleRequest = ArticleFormData;

export type UsePutModifyArticleRequest = {
  body: ArticleFormData & { isImageDeleted?: boolean };
  articleId: number;
};

// ====== API Functions ======
export const newsApi = {
  /**
   * 아티클 목록 조회
   */
  getArticleList: async (userId: number): Promise<ArticleListResponse> => {
    const response: AxiosResponse<ArticleListResponse> = await axiosInstance.get(`/news?author-id=${userId}`);
    return response.data;
  },

  /**
   * 아티클 추가
   */
  postAddArticle: async (body: UsePostAddArticleRequest): Promise<Article> => {
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
  },

  /**
   * 아티클 수정
   */
  putModifyArticle: async (props: UsePutModifyArticleRequest): Promise<Article> => {
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
  },

  /**
   * 아티클 삭제
   */
  deleteArticle: async (articleId: number): Promise<void> => {
    const response: AxiosResponse<void> = await axiosInstance.delete(`/news/${articleId}`);
    return response.data;
  },

  /**
   * 아티클 좋아요
   */
  postArticleLike: async (articleId: number): Promise<PostArticleLikeResponse> => {
    const response: AxiosResponse<PostArticleLikeResponse> = await axiosInstance.post(`/news/${articleId}/like`);
    return response.data;
  },

  /**
   * 아티클 좋아요 취소
   */
  deleteArticleLike: async (articleId: number): Promise<DeleteArticleLikeResponse> => {
    const response: AxiosResponse<DeleteArticleLikeResponse> = await axiosInstance.delete(`/news/${articleId}/like`);
    return response.data;
  },
};
