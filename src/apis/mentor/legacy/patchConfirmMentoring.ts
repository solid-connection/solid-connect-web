import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { mentorApi, ConfirmMentoringResponse, ConfirmMentoringRequest } from "./api";

const usePatchConfirmMentoring = () => {
  return useMutation<ConfirmMentoringResponse, AxiosError, ConfirmMentoringRequest>({
    mutationFn: (data) => mentorApi.patchConfirmMentoring({ data }),
  });
};

export default usePatchConfirmMentoring;