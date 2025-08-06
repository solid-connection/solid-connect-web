import { axiosInstance } from "@/utils/axiosInstance";

import { queryKey } from "./queryKey";

import { MentorCardDetail } from "@/types/mentor";

import { useQuery } from "@tanstack/react-query";

type GetMentorDetailResponse = MentorCardDetail;

const getMentorDetail = async ({ queryKey }: { queryKey: [string, number] }): Promise<GetMentorDetailResponse> => {
  const [, mentorId] = queryKey;
  const res = await axiosInstance.get<GetMentorDetailResponse>(`/mentors/${mentorId}`);
  return res.data;
};

const useGetMentorDetail = (mentorId: number | null) => {
  return useQuery({
    queryKey: [queryKey.mentorDetail, mentorId!],
    queryFn: getMentorDetail,
    enabled: mentorId !== null,
    staleTime: 1000 * 60 * 5, // 5분간 캐시
  });
};

export default useGetMentorDetail;
