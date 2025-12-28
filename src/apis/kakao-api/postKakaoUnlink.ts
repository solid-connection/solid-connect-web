import { AxiosError } from "axios";

import { KakaoUnlinkRequest, KakaoUnlinkResponse, kakaoApiApi } from "./api";

import { useMutation } from "@tanstack/react-query";

const usePostKakaoUnlink = () => {
  return useMutation<KakaoUnlinkResponse, AxiosError, KakaoUnlinkRequest>({
    mutationFn: (data) => kakaoApiApi.postKakaoUnlink({ data }),
  });
};

export default usePostKakaoUnlink;
