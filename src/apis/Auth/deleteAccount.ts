import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { authApi, AccountResponse, AccountRequest } from "./api";

const useDeleteAccount = () => {
  return useMutation<AccountResponse, AxiosError, AccountRequest>({
    mutationFn: (data) => authApi.deleteAccount({ data }),
  });
};

export default useDeleteAccount;