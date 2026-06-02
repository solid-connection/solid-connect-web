import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { type KakaoUnlinkRequest, type KakaoUnlinkResponse, kakaoApiApi } from "./api";

const usePostKakaoUnlink = () => {
  return useMutation<KakaoUnlinkResponse, AxiosError, KakaoUnlinkRequest>({
    mutationFn: (data) => kakaoApiApi.postKakaoUnlink({ data }),
  });
};

export default usePostKakaoUnlink;
