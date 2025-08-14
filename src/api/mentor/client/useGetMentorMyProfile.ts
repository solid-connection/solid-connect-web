import { axiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

import { MentorCardPreview } from "@/types/mentor";

// 학업 학기 (예: "2026-1")
import { useQuery } from "@tanstack/react-query";

type UseGetMyMentorProfileResponse = MentorCardPreview;

const getMentorMyProfile = async (): Promise<UseGetMyMentorProfileResponse> => {
  const res = await axiosInstance.get<UseGetMyMentorProfileResponse>("/mentor/my");
  return res.data;
};

const useGetMentorMyProfile = () => {
  return useQuery({
    queryKey: [QueryKeys.myMentorProfile],
    queryFn: getMentorMyProfile,
    staleTime: 1000 * 60 * 5, // 5분간 캐시
  });
};

export default useGetMentorMyProfile;
