import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { 대학 지원 정보 univApplyInfosApi, 학교 상세 정보 조회Response } from "./api";
import { QueryKeys } from "../queryKeys";

const useGet학교 상세 정보 조회 = (univApplyInfoId: string | number, params?: Record<string, any>) => {
  return useQuery<학교 상세 정보 조회Response, AxiosError>({
    queryKey: [QueryKeys['대학 지원 정보- univ-apply-infos'].학교 상세 정보 조회, univApplyInfoId, params],
    queryFn: () => 대학 지원 정보 univApplyInfosApi.get학교 상세 정보 조회({ univApplyInfoId, params }),
    enabled: !!univApplyInfoId,
  });
};

export default useGet학교 상세 정보 조회;