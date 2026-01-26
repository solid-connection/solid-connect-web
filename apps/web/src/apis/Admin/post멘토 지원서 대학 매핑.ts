import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { adminApi, 멘토 지원서 대학 매핑Response, 멘토 지원서 대학 매핑Request } from "./api";

const usePost멘토 지원서 대학 매핑 = () => {
  return useMutation<멘토 지원서 대학 매핑Response, AxiosError, { mentorApplicationId: string | number; data: 멘토 지원서 대학 매핑Request }>({
    mutationFn: (variables) => adminApi.post멘토 지원서 대학 매핑(variables),
  });
};

export default usePost멘토 지원서 대학 매핑;