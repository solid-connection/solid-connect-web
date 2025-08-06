import { axiosInstance } from "@/utils/axiosInstance";

import { useMutation } from "@tanstack/react-query";

interface UsePostApplyMentoringRequest {
  mentorId: number;
}
interface UsePostApplyMentoringResponse {
  mentoringId: number;
}

const postApplyMentoring = async (body: UsePostApplyMentoringRequest): Promise<UsePostApplyMentoringResponse> => {
  const res = await axiosInstance.post<UsePostApplyMentoringResponse>("/mentee/mentorings", body);
  return res.data;
};

const usePostApplyMentoring = () => {
  return useMutation({
    mutationFn: postApplyMentoring,
  });
};

export default usePostApplyMentoring;
