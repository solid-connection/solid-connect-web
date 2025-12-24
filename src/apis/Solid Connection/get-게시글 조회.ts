import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

export interface PostFindCommentResponsesItem {
  id: number;
  parentId: null;
  content: string;
  isOwner: boolean;
  createdAt: string;
  updatedAt: string;
  postFindSiteUserResponse: PostFindSiteUserResponse;
}

export interface 게시글 조회Response {
  id: number;
  title: string;
  content: string;
  isQuestion: boolean;
  likeCount: number;
  viewCount: number;
  commentCount: number;
  postCategory: string;
  isOwner: boolean;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
  postFindBoardResponse: PostFindBoardResponse;
  postFindSiteUserResponse: PostFindSiteUserResponse;
  postFindCommentResponses: PostFindCommentResponsesItem[];
  postFindPostImageResponses: any[];
}

const 게시글 조회 = async (params: { params?: Record<string, any> }): Promise<게시글 조회Response> => {
  const res = await axiosInstance.get<게시글 조회Response>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const use게시글 조회 = (params?: Record<string, any>) => {
  return useQuery<게시글 조회Response, AxiosError>({
    queryKey: [QueryKeys.solid Connection.게시글 조회, params],
    queryFn: () => 게시글 조회({ params }),
  });
};

export default use게시글 조회;