import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { 7) 어드민Api, 학점 검증 및 수정Response, 학점 검증 및 수정Request } from "./api";

const usePut학점 검증 및 수정 = () => {
  return useMutation<학점 검증 및 수정Response, AxiosError, { gpaScoreId: string | number; data: 학점 검증 및 수정Request }>({
    mutationFn: (variables) => 7) 어드민Api.put학점 검증 및 수정(variables),
  });
};

export default usePut학점 검증 및 수정;