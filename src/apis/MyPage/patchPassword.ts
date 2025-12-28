import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { myPageApi, PasswordResponse, PasswordRequest } from "./api";

const usePatchPassword = () => {
  return useMutation<PasswordResponse, AxiosError, PasswordRequest>({
    mutationFn: (data) => myPageApi.patchPassword({ data }),
  });
};

export default usePatchPassword;