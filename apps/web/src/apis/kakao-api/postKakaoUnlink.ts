import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { kakaoApiApi, KakaoUnlinkResponse, KakaoUnlinkRequest } from "./api";

const usePostKakaoUnlink = () => {
  return useMutation<KakaoUnlinkResponse, AxiosError, KakaoUnlinkRequest>({
    mutationFn: (data) => kakaoApiApi.postKakaoUnlink({ data }),
  });
};

export default usePostKakaoUnlink;