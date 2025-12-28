import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { mentorApi, MentorQueryKeys, MentorCardPreview } from "./api";

/**
 * @description 멘토 마이 프로필 조회 훅
 */
const useGetMentorMyProfile = () => {
  return useQuery<MentorCardPreview, AxiosError>({
    queryKey: [MentorQueryKeys.myMentorProfile],
    queryFn: mentorApi.getMentorMyProfile,
    staleTime: 1000 * 60 * 5, // 5분간 캐시
  });
};

export default useGetMentorMyProfile;