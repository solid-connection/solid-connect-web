import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface DeleteKakaoUnlinkRequest {
  // TODO: Define request type
}

export interface DeleteKakaoUnlinkResponse {
  // TODO: Define response type
}

const deleteKakaoUnlink = async (params: { data?: DeleteKakaoUnlinkRequest }): Promise<DeleteKakaoUnlinkResponse> => {
  const res = await axiosInstance.post<DeleteKakaoUnlinkResponse>(
    `{`, params?.data
  );
  return res.data;
};

const useDeleteKakaoUnlink = () => {
  return useMutation<DeleteKakaoUnlinkResponse, AxiosError, DeleteKakaoUnlinkRequest>({
    mutationFn: (data) => deleteKakaoUnlink({ data }),
  });
};

export default useDeleteKakaoUnlink;