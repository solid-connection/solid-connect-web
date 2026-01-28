import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { authApi, KakaoAuthResponse, KakaoAuthRequest } from "./api";

const usePostKakaoAuth = () => {
  return useMutation<KakaoAuthResponse, AxiosError, KakaoAuthRequest>({
    mutationFn: (data) => authApi.postKakaoAuth({ data }),
  });
};

export default usePostKakaoAuth;