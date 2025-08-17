import { axiosInstance } from "@/utils/axiosInstance";

import { useMutation } from "@tanstack/react-query";

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
  return useMutation({
    mutationFn: patchMenotrCheck,
  });
};

export default usePatchMentorCheckMentorings;
