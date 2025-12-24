import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

export interface ContentItem {
  id: number;
  roomId: number;
  nickname: string;
  profileImageUrl: string;
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

export interface GetMatchedMentorsResponse {
  content: ContentItem[];
  nextPageNumber: number;
}

const getMatchedMentors = async (params: { params?: Record<string, any> }): Promise<GetMatchedMentorsResponse> => {
  const res = await axiosInstance.get<GetMatchedMentorsResponse>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const useGetMatchedMentors = (params?: Record<string, any>) => {
  return useQuery<GetMatchedMentorsResponse, AxiosError>({
    queryKey: [QueryKeys.solid Connection.getMatchedMentors, params],
    queryFn: () => getMatchedMentors({ params }),
  });
};

export default useGetMatchedMentors;