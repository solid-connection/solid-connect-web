import { axiosInstance } from "@/utils/axiosInstance";

import { MentorCardDetail } from "../type/response";
import { queryKey } from "./queryKey";

import { useQuery } from "@tanstack/react-query";

const getMentorDetail = async ({ queryKey }: { queryKey: [string, number] }): Promise<MentorCardDetail> => {
  const [, mentorId] = queryKey;
  const res = await axiosInstance.get<MentorCardDetail>(`/mentors/${mentorId}`);
  return res.data;
};

const useGetMentorDetailPage = (mentorId: number | null) => {
  return useQuery({
    queryKey: [queryKey.mentorDetail, mentorId!],
    queryFn: getMentorDetail,
    enabled: mentorId !== null,
    staleTime: 1000 * 60 * 5, // 5분간 캐시
  });
};

export default useGetMentorDetailPage;
