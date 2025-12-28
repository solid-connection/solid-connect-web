import { AxiosError } from "axios";

import { BlockUserRequest, BlockUserResponse, usersApi } from "./api";

import { useMutation } from "@tanstack/react-query";

const usePostBlockUser = () => {
  return useMutation<BlockUserResponse, AxiosError, { blockedId: string | number; data: BlockUserRequest }>({
    mutationFn: (variables) => usersApi.postBlockUser(variables),
  });
};

export default usePostBlockUser;
