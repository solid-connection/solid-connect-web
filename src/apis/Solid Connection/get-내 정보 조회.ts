import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

export interface 내 정보 조회Response {
  likedUniversityCount: number;
  nickname: string;
  profileImageUrl: string;
  role: string;
  authType: string;
  email: string;
  likedPostCount: number;
  likedMentorCount: number;
  interestedCountries: string[];
}

const 내 정보 조회 = async (params: { params?: Record<string, any> }): Promise<내 정보 조회Response> => {
  const res = await axiosInstance.get<내 정보 조회Response>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const use내 정보 조회 = (params?: Record<string, any>) => {
  return useQuery<내 정보 조회Response, AxiosError>({
    queryKey: [QueryKeys.solid Connection.내 정보 조회, params],
    queryFn: () => 내 정보 조회({ params }),
  });
};

export default use내 정보 조회;