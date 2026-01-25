import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { 3) 마이페이지Api, 내 정보 수정Response, 내 정보 수정Request } from "./api";

const usePatch내 정보 수정 = () => {
  return useMutation<내 정보 수정Response, AxiosError, 내 정보 수정Request>({
    mutationFn: (data) => 3) 마이페이지Api.patch내 정보 수정({ data }),
  });
};

export default usePatch내 정보 수정;