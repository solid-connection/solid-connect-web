import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

export interface ContentItem {
  mentoringId: number;
  profileImageUrl: null;
  nickname: string;
  isChecked: boolean;
  verifyStatus: string;
  createdAt: string;
}

export interface GetReceivedMentoringsResponse {
  content: ContentItem[];
  nextPageNumber: number;
}

const getReceivedMentorings = async (params: { params?: Record<string, any> }): Promise<GetReceivedMentoringsResponse> => {
  const res = await axiosInstance.get<GetReceivedMentoringsResponse>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const useGetReceivedMentorings = (params?: Record<string, any>) => {
  return useQuery<GetReceivedMentoringsResponse, AxiosError>({
    queryKey: [QueryKeys.solid Connection.getReceivedMentorings, params],
    queryFn: () => getReceivedMentorings({ params }),
  });
};

export default useGetReceivedMentorings;