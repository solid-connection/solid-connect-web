import { AxiosError } from "axios";

import { UnblockUserRequest, UnblockUserResponse, usersApi } from "./api";

import { useMutation } from "@tanstack/react-query";

const useDeleteUnblockUser = () => {
  return useMutation<UnblockUserResponse, AxiosError, { blockedId: string | number; data: UnblockUserRequest }>({
    mutationFn: (variables) => usersApi.deleteUnblockUser(variables),
  });
};

export default useDeleteUnblockUser;
