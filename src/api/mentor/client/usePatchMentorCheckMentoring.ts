import { axiosInstance } from "@/utils/axiosInstance";

import { useMutation } from "@tanstack/react-query";

interface UsePatchMentorCheckMentoringRequest {
  checkedMentoringIds: number[];
}
interface UsePatchMentorCheckMentoringResponse {
  checkedMentoringIds: number[]; // 체크된 멘토링 ID 배열
}

const patchMenotrCheck = async (
  body: UsePatchMentorCheckMentoringRequest,
): Promise<UsePatchMentorCheckMentoringResponse> => {
  const res = await axiosInstance.patch<UsePatchMentorCheckMentoringResponse>("/mentor/mentorings/check", body);
  return res.data;
};

const usePatchMentorCheckMentoring = () => {
  return useMutation({
    mutationFn: patchMenotrCheck,
  });
};

export default usePatchMentorCheckMentoring;
