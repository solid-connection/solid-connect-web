import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface PatchPasswordRequest {
  // TODO: Define request type
}

const patchPassword = async (params: { data?: PatchPasswordRequest }): Promise<PatchPasswordResponse> => {
  const res = await axiosInstance.patch<PatchPasswordResponse>(
    `{`, params?.data
  );
  return res.data;
};

const usePatchPassword = () => {
  return useMutation<PatchPasswordResponse, AxiosError, PatchPasswordRequest>({
    mutationFn: (data) => patchPassword({ data }),
  });
};

export default usePatchPassword;