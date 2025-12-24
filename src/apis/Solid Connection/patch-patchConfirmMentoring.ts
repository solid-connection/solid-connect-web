import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface PatchConfirmMentoringRequest {
  // TODO: Define request type
}

export interface PatchConfirmMentoringResponse {
  checkedMentoringIds: number[];
}

const patchConfirmMentoring = async (params: { data?: PatchConfirmMentoringRequest }): Promise<PatchConfirmMentoringResponse> => {
  const res = await axiosInstance.patch<PatchConfirmMentoringResponse>(
    `{`, params?.data
  );
  return res.data;
};

const usePatchConfirmMentoring = () => {
  return useMutation<PatchConfirmMentoringResponse, AxiosError, PatchConfirmMentoringRequest>({
    mutationFn: (data) => patchConfirmMentoring({ data }),
  });
};

export default usePatchConfirmMentoring;