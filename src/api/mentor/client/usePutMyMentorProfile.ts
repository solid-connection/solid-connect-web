import { axiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ChannelPayload {
  type: string;
  url: string;
}

export interface PutMyMentorProfileRequest {
  channels: ChannelPayload[];
  passTip: string;
  introduction: string;
}

const putMyMentorProfile = async (body: PutMyMentorProfileRequest): Promise<void> => {
  const res = await axiosInstance.put<void>("/mentor/me", body);
  return res.data;
};

const usePutMyMentorProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: putMyMentorProfile,
    onSuccess: () => {
      // 멘토 프로필 데이터를 stale로 만들어 다음 요청 시 새로운 데이터를 가져오도록 함
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.myMentorProfile],
      });
    },
  });
};

export default usePutMyMentorProfile;
