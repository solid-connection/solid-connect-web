import { AxiosResponse } from "axios";

import { axiosInstance } from "@/utils/axiosInstance";

import { QueryKeys } from "./queryKey";

import { UserRole } from "@/types/mentor";
import { BaseUserInfo } from "@/types/myInfo";

import { useMutationState, useQuery } from "@tanstack/react-query";

// --- 타입 정의 ---
export interface MenteeInfo extends BaseUserInfo {
  role: UserRole.MENTEE;
  interestedCountries: string[];
}

export interface MentorInfo extends BaseUserInfo {
  role: UserRole.MENTOR;
  attendedUniversity: string;
}

export type MyInfoResponse = MenteeInfo | MentorInfo;

// --- API 호출 함수 ---
const getMyInfo = async (): Promise<MyInfoResponse> => {
  const response: AxiosResponse<MyInfoResponse> = await axiosInstance.get("/my");
  return response.data;
};

const useGetMyInfo = () => {
  const queryResult = useQuery({
    queryKey: [QueryKeys.myInfo],
    queryFn: getMyInfo,
    // staleTime을 무한으로 설정하여 불필요한 자동 refetch를 방지합니다.
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30, // 예: 30분
  });

  const pendingMutations = useMutationState({
    filters: {
      mutationKey: [QueryKeys.myInfo, "patch"],
      status: "pending",
    },
    select: (mutation) => {
      return mutation.state.variables as Partial<MyInfoResponse>;
    },
  });

  const isOptimistic = pendingMutations.length > 0;
  const pendingData = isOptimistic ? pendingMutations[0] : null;

  const displayData = isOptimistic ? { ...queryResult.data, ...pendingData } : queryResult.data;

  return { ...queryResult, data: displayData };
};

export default useGetMyInfo;
