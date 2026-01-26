import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { mentorApi, 멘토 승격 요청Response, 멘토 승격 요청Request } from "./api";

const usePost멘토 승격 요청 = () => {
  return useMutation<멘토 승격 요청Response, AxiosError, 멘토 승격 요청Request>({
    mutationFn: (data) => mentorApi.post멘토 승격 요청({ data }),
  });
};

export default usePost멘토 승격 요청;