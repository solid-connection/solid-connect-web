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
 * @description 지원 목록 조회 훅
 *
 * `GET /applications` 는 전체 지원자 현황을 내려주고 소속 대학을 구분해주지 않는다.
 * 그래서 access token 에서 파싱된 소속 대학(useAuthStore.homeUniversityId)으로
 * 파견학교 목록을 따로 받아, 그 범위에 속한 항목만 남기도록 클라이언트에서 걸러낸다.
 */
const useGetApplicationsList = (
  props?: UseGetApplicationsListOptions,
): UseQueryResult<ApplicationListResponse, AxiosError<{ message: string }>> => {
  const homeUniversityId = useAuthStore((state) => state.homeUniversityId);

  const applicationsQuery = useQuery({
    queryKey: [ApplicationsQueryKeys.competitorsApplicationList],
    queryFn: applicationsApi.getApplicationsList,
    staleTime: 1000 * 60 * 5, // 5분간 캐시
    select: (response) => response.data,
    ...props,
  });

  // 필터 기준이 되는 소속 대학의 파견학교 목록
  const { data: scopedUniversities } = useQuery({
    queryKey: [QueryKeys.universities.searchText, { homeUniversityId }],
    queryFn: () => universitiesApi.getSearchText({ value: "", homeUniversityId: homeUniversityId ?? undefined }),
    enabled: homeUniversityId !== null,
    staleTime: 1000 * 60 * 5,
    select: (response) => response.univApplyInfoPreviews,
  });

  const scopedData = useMemo(() => {
    if (!applicationsQuery.data) {
      return applicationsQuery.data;
    }

    // 소속 대학을 모르면(비인증·학교 미인증) 기존과 동일하게 전체를 보여준다.
    if (homeUniversityId === null) {
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
