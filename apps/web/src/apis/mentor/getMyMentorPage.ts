import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { SKIP_GLOBAL_ERROR_TOAST_META } from "@/lib/react-query/errorToastMeta";
import { type MentorCardPreview, MentorQueryKeys, mentorApi } from "./api";

type UseGetMentorMyProfileParams = {
  enabled?: boolean;
  skipGlobalErrorToast?: boolean;
};

/**
 * @description 멘토 마이 프로필 조회 훅
 */
const useGetMentorMyProfile = ({ enabled = true, skipGlobalErrorToast = false }: UseGetMentorMyProfileParams = {}) => {
  return useQuery<MentorCardPreview, AxiosError>({
    queryKey: [MentorQueryKeys.myMentorProfile],
    queryFn: mentorApi.getMentorMyProfile,
    enabled,
    meta: skipGlobalErrorToast ? SKIP_GLOBAL_ERROR_TOAST_META : undefined,
    staleTime: 1000 * 60 * 5, // 5분간 캐시
  });
};

export default useGetMentorMyProfile;
