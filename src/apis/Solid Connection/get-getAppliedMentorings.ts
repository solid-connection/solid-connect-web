import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

export interface ContentItem {
  mentoringId: number;
  profileImageUrl: null;
  nickname: string;
  isChecked: boolean;
  createdAt: string;
  chatRoomId: number;
}

export interface GetAppliedMentoringsResponse {
  content: ContentItem[];
  nextPageNumber: number;
}

const getAppliedMentorings = async (params: { params?: Record<string, any> }): Promise<GetAppliedMentoringsResponse> => {
  const res = await axiosInstance.get<GetAppliedMentoringsResponse>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const useGetAppliedMentorings = (params?: Record<string, any>) => {
  return useQuery<GetAppliedMentoringsResponse, AxiosError>({
    queryKey: [QueryKeys.solid Connection.getAppliedMentorings, params],
    queryFn: () => getAppliedMentorings({ params }),
  });
};

export default useGetAppliedMentorings;