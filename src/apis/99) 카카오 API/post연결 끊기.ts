import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { 99) 카카오 APIApi, 연결 끊기Response, 연결 끊기Request } from "./api";

const usePost연결 끊기 = () => {
  return useMutation<연결 끊기Response, AxiosError, 연결 끊기Request>({
    mutationFn: (data) => 99) 카카오 APIApi.post연결 끊기({ data }),
  });
};

export default usePost연결 끊기;