import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { 7) 어드민Api, 어학 검증 및 수정Response, 어학 검증 및 수정Request } from "./api";

const usePut어학 검증 및 수정 = () => {
  return useMutation<어학 검증 및 수정Response, AxiosError, { languageTestScoreId: string | number; data: 어학 검증 및 수정Request }>({
    mutationFn: (variables) => 7) 어드민Api.put어학 검증 및 수정(variables),
  });
};

export default usePut어학 검증 및 수정;