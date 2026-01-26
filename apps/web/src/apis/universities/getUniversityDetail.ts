import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { universitiesApi, UniversityDetailResponse } from "./api";
import { QueryKeys } from "../queryKeys";

const useGetUniversityDetail = (univApplyInfoId: string | number, params?: Record<string, any>) => {
  return useQuery<UniversityDetailResponse, AxiosError>({
    queryKey: [QueryKeys.universities.universityDetail, univApplyInfoId, params],
    queryFn: () => universitiesApi.getUniversityDetail({ univApplyInfoId, params }),
    enabled: !!univApplyInfoId,
  });
};

export default useGetUniversityDetail;