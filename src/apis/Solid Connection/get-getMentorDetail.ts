import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

export interface ChannelsItem {
  type: string;
  url: string;
}

export interface GetMentorDetailResponse {
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
  passTip: string;
  isApplied: boolean;
}

const getMentorDetail = async (params: { params?: Record<string, any> }): Promise<GetMentorDetailResponse> => {
  const res = await axiosInstance.get<GetMentorDetailResponse>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const useGetMentorDetail = (params?: Record<string, any>) => {
  return useQuery<GetMentorDetailResponse, AxiosError>({
    queryKey: [QueryKeys.solid Connection.getMentorDetail, params],
    queryFn: () => getMentorDetail({ params }),
  });
};

export default useGetMentorDetail;