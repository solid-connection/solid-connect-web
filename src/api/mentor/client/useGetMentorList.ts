import { axiosInstance } from "@/utils/axiosInstance";

import { MentorCardDetail } from "../type/response";

import { useQuery } from "@tanstack/react-query";

interface UseGetMentorListProps {
  region?: string;
  page?: number;
}

interface MentorListResponse {
  /** 다음 페이지 번호. 다음 페이지가 없으면 -1 */
  nextPageNumber: number;
  content: MentorCardDetail[];
}

const OFFSET = 10; // 기본 페이지 크기

const getMentorList = async ({ queryKey }: { queryKey: [string, string, number] }): Promise<MentorListResponse> => {
  const [, region, page] = queryKey;
  const res = await axiosInstance.get<MentorListResponse>(`/mentor?region=${region}&page=${page}&size=${OFFSET}`);
  return res.data;
};

const useGetMentorList = ({ region = "전체", page = 0 }: UseGetMentorListProps = {}) => {
  return useQuery({
    queryKey: ["mentor-list", region, page],
    queryFn: getMentorList,
    staleTime: 1000 * 60 * 5, // 5분간 캐시
  });
};

export default useGetMentorList;
