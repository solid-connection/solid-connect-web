import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { usersApi, UnblockUserResponse, UnblockUserRequest } from "./api";

const useDeleteUnblockUser = () => {
  return useMutation<UnblockUserResponse, AxiosError, { blockedId: string | number; data: UnblockUserRequest }>({
    mutationFn: (variables) => usersApi.deleteUnblockUser(variables),
  });
};

export default useDeleteUnblockUser;