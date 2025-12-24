import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

export interface ChannelsItem {
  type: string;
  url: string;
}

export interface GetMyMentorPageResponse {
  id: number;
  profileImageUrl: null;
  nickname: string;
  country: string;
  universityName: string;
  term: string;
  menteeCount: number;
  hasBadge: boolean;
  introduction: string;
  passTip: string;
  channels: ChannelsItem[];
}

const getMyMentorPage = async (params: { params?: Record<string, any> }): Promise<GetMyMentorPageResponse> => {
  const res = await axiosInstance.get<GetMyMentorPageResponse>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const useGetMyMentorPage = (params?: Record<string, any>) => {
  return useQuery<GetMyMentorPageResponse, AxiosError>({
    queryKey: [QueryKeys.solid Connection.getMyMentorPage, params],
    queryFn: () => getMyMentorPage({ params }),
  });
};

export default useGetMyMentorPage;