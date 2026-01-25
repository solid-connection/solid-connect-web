import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { 6) 성적 등록Api, 학점 등록Response, 학점 등록Request } from "./api";

const usePost학점 등록 = () => {
  return useMutation<학점 등록Response, AxiosError, 학점 등록Request>({
    mutationFn: (data) => 6) 성적 등록Api.post학점 등록({ data }),
  });
};

export default usePost학점 등록;