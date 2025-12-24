import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface PatchMentoringStatusRequest {
  // TODO: Define request type
}

export interface PatchMentoringStatusResponse {
  mentoringId: number;
}

const patchMentoringStatus = async (params: { data?: PatchMentoringStatusRequest }): Promise<PatchMentoringStatusResponse> => {
  const res = await axiosInstance.patch<PatchMentoringStatusResponse>(
    `{`, params?.data
  );
  return res.data;
};

const usePatchMentoringStatus = () => {
  return useMutation<PatchMentoringStatusResponse, AxiosError, PatchMentoringStatusRequest>({
    mutationFn: (data) => patchMentoringStatus({ data }),
  });
};

export default usePatchMentoringStatus;