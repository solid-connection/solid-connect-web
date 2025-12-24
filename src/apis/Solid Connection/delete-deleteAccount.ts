import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export interface DeleteAccountRequest {
  // TODO: Define request type
}

const deleteAccount = async (): Promise<DeleteAccountResponse> => {
  const res = await axiosInstance.delete<DeleteAccountResponse>(
    `{`
  );
  return res.data;
};

const useDeleteAccount = () => {
  return useMutation<DeleteAccountResponse, AxiosError, DeleteAccountRequest>({
    mutationFn: (data) => deleteAccount({ data }),
  });
};

export default useDeleteAccount;