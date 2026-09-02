import { type UseQueryOptions, type UseQueryResult, useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { useMemo } from "react";

import useAuthStore from "@/lib/zustand/useAuthStore";
import type { ApplicationListResponse } from "@/types/application";
import { QueryKeys } from "../queryKeys";
import { universitiesApi } from "../universities/api";
import { ApplicationsQueryKeys, applicationsApi } from "./api";
import { filterApplicationsByHomeUniversityScope } from "./homeUniversityScope";

type UseGetApplicationsListOptions = Omit<
  UseQueryOptions<AxiosResponse<ApplicationListResponse>, AxiosError<{ message: string }>, ApplicationListResponse>,
  "queryKey" | "queryFn"
>;

/**
 * 지원 기간에는 지원한 대학만, 기간 종료 후에는 소속 대학의 전체 현황을 공개한다.
 * 전체 현황을 다시 공개할 때 반환값을 "applications"로 변경한다.
 */
type ApplicationStatusEndpoint = "applications" | "competitors";

const getApplicationStatusEndpoint = (): ApplicationStatusEndpoint => "competitors";

const applicationStatusEndpoint = getApplicationStatusEndpoint();
const shouldFilterByHomeUniversity = applicationStatusEndpoint === "applications";
const applicationStatusQueryFn =
  applicationStatusEndpoint === "competitors" ? applicationsApi.getCompetitors : applicationsApi.getApplicationsList;

/**
 * @description 내가 지원한 대학의 지원자 현황 조회 훅
 */
const useGetApplicationsList = (
  props?: UseGetApplicationsListOptions,
): UseQueryResult<ApplicationListResponse, AxiosError<{ message: string }>> => {
  const homeUniversityId = useAuthStore((state) => state.homeUniversityId);

  const applicationsQuery = useQuery({
    queryKey: [ApplicationsQueryKeys.competitorsApplicationList],
    queryFn: applicationStatusQueryFn,
    staleTime: 1000 * 60 * 5, // 5분간 캐시
    select: (response) => response.data,
    ...props,
  });

  // GET /applications를 사용할 때만 소속 대학의 파견학교 목록으로 범위를 제한한다.
  const { data: scopedUniversities } = useQuery({
    queryKey: [QueryKeys.universities.searchText, { homeUniversityId }],
    queryFn: () => universitiesApi.getSearchText({ value: "", homeUniversityId: homeUniversityId ?? undefined }),
    enabled: shouldFilterByHomeUniversity && homeUniversityId !== null,
    staleTime: 1000 * 60 * 5,
    select: (response) => response.univApplyInfoPreviews,
  });

  const scopedData = useMemo(() => {
    if (!applicationsQuery.data || !shouldFilterByHomeUniversity || homeUniversityId === null) {
      return applicationsQuery.data;
    }

    return filterApplicationsByHomeUniversityScope(applicationsQuery.data, scopedUniversities);
  }, [applicationsQuery.data, homeUniversityId, scopedUniversities]);

  return { ...applicationsQuery, data: scopedData } as UseQueryResult<
    ApplicationListResponse,
    AxiosError<{ message: string }>
  >;
};

export default useGetApplicationsList;
