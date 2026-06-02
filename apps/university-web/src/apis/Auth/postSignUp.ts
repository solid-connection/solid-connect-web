import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { authApi, type SignUpRequest, type SignUpResponse } from "./api";

/**
 * @description 회원가입을 위한 useMutation 커스텀 훅
 */
const usePostSignUp = () => {
  return useMutation<SignUpResponse, AxiosError, SignUpRequest>({
    mutationFn: (data) => authApi.postSignUp(data),
  });
};

export default usePostSignUp;
