import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { 6) 성적 등록Api, 어학 성적 등록Response, 어학 성적 등록Request } from "./api";

const usePost어학 성적 등록 = () => {
  return useMutation<어학 성적 등록Response, AxiosError, 어학 성적 등록Request>({
    mutationFn: (data) => 6) 성적 등록Api.post어학 성적 등록({ data }),
  });
};

export default usePost어학 성적 등록;