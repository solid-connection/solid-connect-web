import { axiosInstance } from "@/utils/axiosInstance";

import { useMutation } from "@tanstack/react-query";

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
  return useMutation({
    mutationFn: putMyMentorProfile,
  });
};

export default usePutMyMentorProfile;
