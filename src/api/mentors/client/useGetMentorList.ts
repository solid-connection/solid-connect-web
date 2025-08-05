import { axiosInstance } from "@/utils/axiosInstance";

import { queryKey } from "./queryKey";

import { MentorCardDetail } from "@/types/mentor";

import { useQuery } from "@tanstack/react-query";

interface UseGetMentorListRequest {
  region?: string;
  page?: number;
}

interface GetMentorListResponse {
  /** 다음 페이지 번호. 다음 페이지가 없으면 -1 */
  nextPageNumber: number;
  content: MentorCardDetail[];
}

const OFFSET = 10; // 기본 페이지 크기

const getMentorList = async ({ queryKey }: { queryKey: [string, string, number] }): Promise<GetMentorListResponse> => {
  const [, region, page] = queryKey;
  const res = await axiosInstance.get<GetMentorListResponse>(`/mentor?region=${region}&page=${page}&size=${OFFSET}`);
  return res.data;
};

const useGetMentorList = ({ region = "전체", page = 0 }: UseGetMentorListRequest = {}) => {
  return useQuery({
    queryKey: [queryKey.mentorList, region, page],
    queryFn: getMentorList,
    staleTime: 1000 * 60 * 5, // 5분간 캐시
  });
};

export default useGetMentorList;
