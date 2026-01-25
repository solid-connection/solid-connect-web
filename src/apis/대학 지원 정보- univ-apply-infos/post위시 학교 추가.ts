import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { 대학 지원 정보 univApplyInfosApi, 위시 학교 추가Response, 위시 학교 추가Request } from "./api";

const usePost위시 학교 추가 = () => {
  return useMutation<위시 학교 추가Response, AxiosError, { univApplyInfoId: string | number; data: 위시 학교 추가Request }>({
    mutationFn: (variables) => 대학 지원 정보 univApplyInfosApi.post위시 학교 추가(variables),
  });
};

export default usePost위시 학교 추가;