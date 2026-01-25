import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { 11) 신고Api, 신고하기Response, 신고하기Request } from "./api";

const usePost신고하기 = () => {
  return useMutation<신고하기Response, AxiosError, 신고하기Request>({
    mutationFn: (data) => 11) 신고Api.post신고하기({ data }),
  });
};

export default usePost신고하기;