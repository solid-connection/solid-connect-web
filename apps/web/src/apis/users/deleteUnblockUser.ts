import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { type UnblockUserRequest, type UnblockUserResponse, usersApi } from "./api";

const useDeleteUnblockUser = () => {
  return useMutation<UnblockUserResponse, AxiosError, { blockedId: string | number; data: UnblockUserRequest }>({
    mutationFn: (variables) => usersApi.deleteUnblockUser(variables),
  });
};

export default useDeleteUnblockUser;
