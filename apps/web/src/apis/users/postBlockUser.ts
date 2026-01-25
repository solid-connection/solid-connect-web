import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { type BlockUserRequest, type BlockUserResponse, usersApi } from "./api";

const usePostBlockUser = () => {
  return useMutation<BlockUserResponse, AxiosError, { blockedId: string | number; data: BlockUserRequest }>({
    mutationFn: (variables) => usersApi.postBlockUser(variables),
  });
};

export default usePostBlockUser;
