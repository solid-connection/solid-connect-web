import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

export interface PostFindPostImageResponsesItem {
  id: number;
  imageUrl: string;
}

export interface PostFindCommentResponsesItem {
  id: number;
  parentId: null;
  content: string;
  isOwner: boolean;
  createdAt: string;
  updatedAt: string;
  postFindSiteUserResponse: PostFindSiteUserResponse;
}

export interface GetPostDetailResponse {
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
  postFindPostImageResponses: PostFindPostImageResponsesItem[];
}

const getPostDetail = async (params: { params?: Record<string, any> }): Promise<GetPostDetailResponse> => {
  const res = await axiosInstance.get<GetPostDetailResponse>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const useGetPostDetail = (params?: Record<string, any>) => {
  return useQuery<GetPostDetailResponse, AxiosError>({
    queryKey: [QueryKeys.solid Connection.getPostDetail, params],
    queryFn: () => getPostDetail({ params }),
  });
};

export default useGetPostDetail;