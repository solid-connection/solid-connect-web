import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface PatchProfileRequest {
  // TODO: Define request type
}

export interface PatchProfileResponse {

}

const patchProfile = async (params: { data?: PatchProfileRequest }): Promise<PatchProfileResponse> => {
  const res = await axiosInstance.patch<PatchProfileResponse>(
    `{`, params?.data
  );
  return res.data;
};

const usePatchProfile = () => {
  return useMutation<PatchProfileResponse, AxiosError, PatchProfileRequest>({
    mutationFn: (data) => patchProfile({ data }),
  });
};

export default usePatchProfile;