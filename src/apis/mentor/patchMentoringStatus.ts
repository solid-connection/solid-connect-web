import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { mentorApi, MentoringStatusResponse, MentoringStatusRequest } from "./api";

const usePatchMentoringStatus = () => {
  return useMutation<MentoringStatusResponse, AxiosError, { mentoringId: string | number; data: MentoringStatusRequest }>({
    mutationFn: (variables) => mentorApi.patchMentoringStatus(variables),
  });
};

export default usePatchMentoringStatus;