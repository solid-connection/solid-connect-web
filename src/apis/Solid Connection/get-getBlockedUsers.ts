import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

export interface ContentItem {
  id: number;
  blockedId: number;
  nickname: string;
  createdAt: string;
}

export interface GetBlockedUsersResponse {
  content: ContentItem[];
  nextPageNumber: number;
}

const getBlockedUsers = async (params: { params?: Record<string, any> }): Promise<GetBlockedUsersResponse> => {
  const res = await axiosInstance.get<GetBlockedUsersResponse>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const useGetBlockedUsers = (params?: Record<string, any>) => {
  return useQuery<GetBlockedUsersResponse, AxiosError>({
    queryKey: [QueryKeys.solid Connection.getBlockedUsers, params],
    queryFn: () => getBlockedUsers({ params }),
  });
};

export default useGetBlockedUsers;