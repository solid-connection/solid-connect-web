import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface DeleteUnblockUserRequest {
  // TODO: Define request type
}

const deleteUnblockUser = async (): Promise<DeleteUnblockUserResponse> => {
  const res = await axiosInstance.delete<DeleteUnblockUserResponse>(
    `{`
  );
  return res.data;
};

const useDeleteUnblockUser = () => {
  return useMutation<DeleteUnblockUserResponse, AxiosError, DeleteUnblockUserRequest>({
    mutationFn: (data) => deleteUnblockUser({ data }),
  });
};

export default useDeleteUnblockUser;