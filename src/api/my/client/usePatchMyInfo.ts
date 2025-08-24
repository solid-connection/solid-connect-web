import { AxiosError } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface UseMyMentorProfileRequest {
  nickname?: string;
  file?: File;
}

const patchMyMentorProfile = async (data: UseMyMentorProfileRequest): Promise<void> => {
  const formData = new FormData();
  if (data.nickname) {
    formData.append("nickname", data.nickname);
  }
  if (data.file) {
    formData.append("file", data.file);
  }
  console.log("폼데이터"); // 폼데이터 확인용

  const res = await axiosInstance.patch<void>("/my", formData);

  return res.data;
};

const usePatchMyInfo = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<{ message: string }>, UseMyMentorProfileRequest>({
    mutationKey: [QueryKeys.myInfo, "patch"],
    mutationFn: patchMyMentorProfile,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.myInfo],
      });
    },
    onSuccess: () => {
      alert("프로필이 성공적으로 수정되었습니다.");
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message;
      alert(errorMessage || "프로필 수정에 실패했습니다. 다시 시도해주세요.");
    },
  });
};

export default usePatchMyInfo;
