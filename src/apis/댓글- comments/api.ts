import { axiosInstance } from "@/utils/axiosInstance";

export type 댓글 삭제Response = void;

export type 댓글 수정Response = void;

export type 댓글 수정Request = Record<string, never>;

export type 댓글 작성Response = void;

export type 댓글 작성Request = Record<string, never>;

export const 댓글 commentsApi = {
  delete댓글 삭제: async (params: { commentId: string | number }): Promise<댓글 삭제Response> => {
    const res = await axiosInstance.delete<댓글 삭제Response>(
      `/comments/${params.commentId}`
    );
    return res.data;
  },

  patch댓글 수정: async (params: { commentId: string | number, data?: 댓글 수정Request }): Promise<댓글 수정Response> => {
    const res = await axiosInstance.patch<댓글 수정Response>(
      `/comments/${params.commentId}`, params?.data
    );
    return res.data;
  },

  post댓글 작성: async (params: { data?: 댓글 작성Request }): Promise<댓글 작성Response> => {
    const res = await axiosInstance.post<댓글 작성Response>(
      `/comments`, params?.data
    );
    return res.data;
  },

};