import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { MentorQueryKeys, mentorApi, type PutMyMentorProfileRequest } from "./api";

/**
 * @description 내 멘토 프로필 수정 훅
 */
const usePutMyMentorProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, PutMyMentorProfileRequest>({
    mutationFn: mentorApi.putMyMentorProfile,
    onSuccess: () => {
      // 멘토 프로필 데이터를 stale로 만들어 다음 요청 시 새로운 데이터를 가져오도록 함
      queryClient.invalidateQueries({
        queryKey: [MentorQueryKeys.myMentorProfile],
      });
    },
  });
};

export default usePutMyMentorProfile;
