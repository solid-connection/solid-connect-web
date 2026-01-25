import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { 멘티만 요청 가능Api, 멘토링 확인Response, 멘토링 확인Request } from "./api";

const usePatch멘토링 확인 = () => {
  return useMutation<멘토링 확인Response, AxiosError, 멘토링 확인Request>({
    mutationFn: (data) => 멘티만 요청 가능Api.patch멘토링 확인({ data }),
  });
};

export default usePatch멘토링 확인;