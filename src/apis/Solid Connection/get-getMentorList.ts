import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

export interface ContentItem {
  id: number;
  profileImageUrl: string;
  nickname: string;
  country: string;
  universityName: string;
  term: string;
  menteeCount: number;
  hasBadge: boolean;
  introduction: string;
  channels: ChannelsItem[];
  isApplied: boolean;
}

export interface ChannelsItem {
  type: string;
  url: string;
}

export interface GetMentorListResponse {
  nextPageNumber: number;
  content: ContentItem[];
}

const getMentorList = async (params: { params?: Record<string, any> }): Promise<GetMentorListResponse> => {
  const res = await axiosInstance.get<GetMentorListResponse>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const useGetMentorList = (params?: Record<string, any>) => {
  return useQuery<GetMentorListResponse, AxiosError>({
    queryKey: [QueryKeys.solid Connection.getMentorList, params],
    queryFn: () => getMentorList({ params }),
  });
};

export default useGetMentorList;