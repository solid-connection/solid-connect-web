import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

export interface GetBoardResponseItem {
  id: number;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  postCategory: string;
  postThumbnailUrl: null;
}

export interface GetBoardResponse {
  0: 0;
  1: 1;
  2: 2;
  3: 3;
}

const getBoard = async (params: { params?: Record<string, any> }): Promise<GetBoardResponse> => {
  const res = await axiosInstance.get<GetBoardResponse>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const useGetBoard = (params?: Record<string, any>) => {
  return useQuery<GetBoardResponse, AxiosError>({
    queryKey: [QueryKeys.solid Connection.getBoard, params],
    queryFn: () => getBoard({ params }),
  });
};

export default useGetBoard;