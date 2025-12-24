import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

export interface NewsResponseListItem {
  id: number;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  updatedAt: string;
}

export interface GetNewsListResponse {
  newsResponseList: NewsResponseListItem[];
}

const getNewsList = async (params: { params?: Record<string, any> }): Promise<GetNewsListResponse> => {
  const res = await axiosInstance.get<GetNewsListResponse>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const useGetNewsList = (params?: Record<string, any>) => {
  return useQuery<GetNewsListResponse, AxiosError>({
    queryKey: [QueryKeys.solid Connection.getNewsList, params],
    queryFn: () => getNewsList({ params }),
  });
};

export default useGetNewsList;