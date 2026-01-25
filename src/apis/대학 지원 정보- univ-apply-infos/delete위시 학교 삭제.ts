import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { 대학 지원 정보 univApplyInfosApi, 위시 학교 삭제Response, 위시 학교 삭제Request } from "./api";

const useDelete위시 학교 삭제 = () => {
  return useMutation<위시 학교 삭제Response, AxiosError, { univApplyInfoId: string | number; data: 위시 학교 삭제Request }>({
    mutationFn: (variables) => 대학 지원 정보 univApplyInfosApi.delete위시 학교 삭제(variables),
  });
};

export default useDelete위시 학교 삭제;