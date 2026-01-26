import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { adminApi, 멘토 승격 요청 거절Response, 멘토 승격 요청 거절Request } from "./api";

const usePost멘토 승격 요청 거절 = () => {
  return useMutation<멘토 승격 요청 거절Response, AxiosError, { mentorApplicationId: string | number; data: 멘토 승격 요청 거절Request }>({
    mutationFn: (variables) => adminApi.post멘토 승격 요청 거절(variables),
  });
};

export default usePost멘토 승격 요청 거절;