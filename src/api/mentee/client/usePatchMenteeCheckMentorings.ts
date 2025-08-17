import { AxiosError } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { useMutation } from "@tanstack/react-query";

interface UsePatchMenteeCheckMentoringsRequest {
  checkedMentoringIds: number[];
}

interface UsePatchMenteeCheckMentoringsResponse {
  checkedMentoringIds: number[];
}

const patchMenteeCheckMentorings = async (
  body: UsePatchMenteeCheckMentoringsRequest,
): Promise<UsePatchMenteeCheckMentoringsResponse> => {
  const res = await axiosInstance.patch<UsePatchMenteeCheckMentoringsResponse>("/mentee/mentorings/check", body);
  return res.data;
};

const usePatchMenteeCheckMentorings = () =>
  useMutation<UsePatchMenteeCheckMentoringsResponse, AxiosError, UsePatchMenteeCheckMentoringsRequest>({
    mutationFn: patchMenteeCheckMentorings,
  });

export default usePatchMenteeCheckMentorings;
