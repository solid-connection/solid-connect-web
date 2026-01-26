import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { adminApi, 멘토 요청 승격 처리Response, 멘토 요청 승격 처리Request } from "./api";

const usePost멘토 요청 승격 처리 = () => {
  return useMutation<멘토 요청 승격 처리Response, AxiosError, { mentorApplicationId: string | number; data: 멘토 요청 승격 처리Request }>({
    mutationFn: (variables) => adminApi.post멘토 요청 승격 처리(variables),
  });
};

export default usePost멘토 요청 승격 처리;