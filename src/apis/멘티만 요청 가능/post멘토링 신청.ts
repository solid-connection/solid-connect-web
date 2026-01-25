import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { 멘티만 요청 가능Api, 멘토링 신청Response, 멘토링 신청Request } from "./api";

const usePost멘토링 신청 = () => {
  return useMutation<멘토링 신청Response, AxiosError, 멘토링 신청Request>({
    mutationFn: (data) => 멘티만 요청 가능Api.post멘토링 신청({ data }),
  });
};

export default usePost멘토링 신청;