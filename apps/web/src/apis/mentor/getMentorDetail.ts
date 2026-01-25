import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { type MentorCardDetail, MentorQueryKeys, mentorApi } from "./api";

/**
 * @description 멘토 상세 조회 훅
 */
const useGetMentorDetail = (mentorId: number | null) => {
  return useQuery<MentorCardDetail, AxiosError>({
    queryKey: [MentorQueryKeys.mentorDetail, mentorId!],
    queryFn: () => mentorApi.getMentorDetail(mentorId!),
    enabled: mentorId !== null,
    staleTime: 1000 * 60 * 5, // 5분간 캐시
  });
};

export default useGetMentorDetail;
