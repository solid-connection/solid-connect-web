import { AxiosError } from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { QueryKeys } from "../queryKeys";
import { useQuery } from "@tanstack/react-query";

export interface GetProfileResponse {
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

const getProfile = async (params: { params?: Record<string, any> }): Promise<GetProfileResponse> => {
  const res = await axiosInstance.get<GetProfileResponse>(
    `{`, { params: params?.params }
  );
  return res.data;
};

const useGetProfile = (params?: Record<string, any>) => {
  return useQuery<GetProfileResponse, AxiosError>({
    queryKey: [QueryKeys.solid Connection.getProfile, params],
    queryFn: () => getProfile({ params }),
  });
};

export default useGetProfile;