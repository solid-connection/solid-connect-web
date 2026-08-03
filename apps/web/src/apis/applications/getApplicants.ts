import { type UseQueryOptions, type UseQueryResult, useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

import useAuthStore from "@/lib/zustand/useAuthStore";
import type { ApplicationListResponse } from "@/types/application";
import { ApplicationsQueryKeys, applicationsApi } from "./api";

type UseGetApplicationsListOptions = Omit<
  UseQueryOptions<AxiosResponse<ApplicationListResponse>, AxiosError<{ message: string }>, ApplicationListResponse>,
  "queryKey" | "queryFn"
>;

/**
 * @description 지원 목록 조회 훅
 *
 * 소속 대학(homeUniversityId)은 access token 에서 파싱되어 useAuthStore 에 담긴 값을 사용한다.
 * 다른 소속 대학의 응답이 캐시에 섞이지 않도록 queryKey 에도 포함한다.
 */
const useGetApplicationsList = (
  props?: UseGetApplicationsListOptions,
): UseQueryResult<ApplicationListResponse, AxiosError<{ message: string }>> => {
  const homeUniversityId = useAuthStore((state) => state.homeUniversityId);

  return useQuery({
    queryKey: [ApplicationsQueryKeys.competitorsApplicationList, homeUniversityId],
    queryFn: () => applicationsApi.getApplicationsList({ homeUniversityId }),
    staleTime: 1000 * 60 * 5, // 5분간 캐시
    select: (response) => response.data,
    ...props,
  });
};

export default useGetApplicationsList;
