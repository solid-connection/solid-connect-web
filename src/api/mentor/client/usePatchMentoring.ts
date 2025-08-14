import { axiosInstance } from "@/utils/axiosInstance";

import { useMutation } from "@tanstack/react-query";

interface UsePatchMentoringRequest {
  checkedMentoringIds: number[];
}
interface UsePatchMentoringResponse {
  checkedMentoringIds: number[]; // 체크된 멘토링 ID 배열
}

const patchMentoring = async (body: UsePatchMentoringRequest): Promise<UsePatchMentoringResponse> => {
  const res = await axiosInstance.patch<UsePatchMentoringResponse>("/mentor/mentorings/check", body);
  return res.data;
};

const usePatchMentoring = () => {
  return useMutation({
    mutationFn: patchMentoring,
  });
};

export default usePatchMentoring;
