import { axiosInstance } from "@/utils/axiosInstance";

import { MentorCardPreview } from "../type/response";
import { queryKey } from "./queryKey";

import { useQuery } from "@tanstack/react-query";

const getMyMentorProfile = async (): Promise<MentorCardPreview> => {
  const res = await axiosInstance.get<MentorCardPreview>("/mentor/my");
  return res.data;
};

const useGetMyMentorProfile = () => {
  return useQuery({
    queryKey: [queryKey.myMentorProfile],
    queryFn: getMyMentorProfile,
    staleTime: 1000 * 60 * 5, // 5분간 캐시
  });
};

export default useGetMyMentorProfile;
