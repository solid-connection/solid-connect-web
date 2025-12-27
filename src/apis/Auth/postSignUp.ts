import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { authApi, SignUpResponse, SignUpRequest } from "./api";

const usePostSignUp = () => {
  return useMutation<SignUpResponse, AxiosError, SignUpRequest>({
    mutationFn: (data) => authApi.postSignUp({ data }),
  });
};

export default usePostSignUp;