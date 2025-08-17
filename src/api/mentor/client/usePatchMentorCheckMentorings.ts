import { axiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UsePatchMentorCheckMentoringsRequest {
  checkedMentoringIds: number[];
}
interface UsePatchMentorCheckMentoringsResponse {
  checkedMentoringIds: number[]; // 체크된 멘토링 ID 배열
}

const patchMenotrCheck = async (
  body: UsePatchMentorCheckMentoringsRequest,
): Promise<UsePatchMentorCheckMentoringsResponse> => {
  const res = await axiosInstance.patch<UsePatchMentorCheckMentoringsResponse>("/mentor/mentorings/check", body);
  return res.data;
};

const usePatchMentorCheckMentorings = () => {
  const queriesClient = useQueryClient();
  return useMutation({
    onSuccess: () => {
      // 멘토링 체크 상태 변경 후 멘토링 목록 쿼리 무효화
      queriesClient.invalidateQueries({
        queryKey: [QueryKeys.mentoringNewCount, QueryKeys.mentoringList],
      });
    },
    mutationFn: patchMenotrCheck,
  });
};

export default usePatchMentorCheckMentorings;
