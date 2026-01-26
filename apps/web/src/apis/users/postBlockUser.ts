import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { usersApi, BlockUserResponse, BlockUserRequest } from "./api";

const usePostBlockUser = () => {
  return useMutation<BlockUserResponse, AxiosError, { blockedId: string | number; data: BlockUserRequest }>({
    mutationFn: (variables) => usersApi.postBlockUser(variables),
  });
};

export default usePostBlockUser;