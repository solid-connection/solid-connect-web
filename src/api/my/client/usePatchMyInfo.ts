import { axiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface UseMyMentorProfileRequest {
  nickname: string;
  file?: File;
}

const patchMyMentorProfile = async (data: UseMyMentorProfileRequest): Promise<void> => {
  const formData = new FormData();
  formData.append("nickname", data.nickname);
  if (data.file) {
    formData.append("file", data.file);
  }

  const res = await axiosInstance.patch<void>("/mentor/my", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

const usePatchMyInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchMyMentorProfile,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.myInfo],
      });
    },
  });
};

export default usePatchMyInfo;
