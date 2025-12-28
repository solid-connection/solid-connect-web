import { AxiosError } from "axios";

import { ConfirmMentoringRequest, ConfirmMentoringResponse, mentorApi } from "./api";

import { useMutation } from "@tanstack/react-query";

const usePatchConfirmMentoring = () => {
  return useMutation<ConfirmMentoringResponse, AxiosError, ConfirmMentoringRequest>({
    mutationFn: (data) => mentorApi.patchConfirmMentoring({ data }),
  });
};

export default usePatchConfirmMentoring;
