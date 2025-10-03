import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/zustand/useToastStore";

interface UsePostGpaScoreRequest {
  gpaScoreRequest: {
    gpa: number;
    gpaCriteria: number;
    issueDate: string; // yyyy-MM-dd
  };
  file: Blob;
}

export const postGpaScore = (request: UsePostGpaScoreRequest): Promise<AxiosResponse<null>> => {
  const convertedRequest: FormData = new FormData();
  convertedRequest.append(
    "gpaScoreRequest",
    new Blob([JSON.stringify(request.gpaScoreRequest)], { type: "application/json" }),
  );
  convertedRequest.append("file", request.file);
  return axiosInstance.post("/scores/gpas", convertedRequest);
};

export const usePostGpaScore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UsePostGpaScoreRequest) => postGpaScore(request),

    onSuccess: () => {
      toast.success("학점 정보가 성공적으로 제출되었습니다.");
      queryClient.invalidateQueries({ queryKey: [QueryKeys.myGpaScore] });
    },

    onError: (error) => {
      console.error("학점 제출 중 오류 발생:", error);
      toast.error("오류가 발생했습니다. 다시 시도해주세요.");
    },
  });
};
