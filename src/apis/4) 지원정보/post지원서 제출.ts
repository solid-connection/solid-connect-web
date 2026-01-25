import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { 4) 지원정보Api, 지원서 제출Response, 지원서 제출Request } from "./api";

const usePost지원서 제출 = () => {
  return useMutation<지원서 제출Response, AxiosError, 지원서 제출Request>({
    mutationFn: (data) => 4) 지원정보Api.post지원서 제출({ data }),
  });
};

export default usePost지원서 제출;