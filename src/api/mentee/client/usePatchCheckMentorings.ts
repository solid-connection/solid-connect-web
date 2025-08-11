import { AxiosError } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { useMutation } from "@tanstack/react-query";

interface UsePatchCheckMentoringsRequest {
  checkedMentoringIds: number[];
}

interface UsePatchCheckMentoringsResponse {
  checkedMentoringIds: number[];
}

const patchCheckMentorings = async (body: UsePatchCheckMentoringsRequest): Promise<UsePatchCheckMentoringsResponse> => {
  const res = await axiosInstance.patch<UsePatchCheckMentoringsResponse>("/mentee/mentorings/check", body);
  return res.data;
};

const usePatchCheckMentorings = () =>
  useMutation<UsePatchCheckMentoringsResponse, AxiosError, UsePatchCheckMentoringsRequest>({
    mutationFn: patchCheckMentorings,
  });

export default usePatchCheckMentorings;
