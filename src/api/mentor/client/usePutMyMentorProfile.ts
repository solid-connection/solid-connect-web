import { axiosInstance } from "@/utils/axiosInstance";

import { useMutation } from "@tanstack/react-query";

/* ---------- 타입 ---------- */
export interface ChannelPayload {
  type: string;
  url: string;
}

export interface PutMyMentorProfileBody {
  channels: ChannelPayload[];
  passTip: string;
  introduction: string;
}

const putMyMentorProfile = async (body: PutMyMentorProfileBody): Promise<void> => {
  const res = await axiosInstance.put<void>("/mentors/me", body);
  return res.data;
};

const usePutMyMentorProfile = () => {
  return useMutation({
    mutationFn: putMyMentorProfile,
  });
};

export default usePutMyMentorProfile;
