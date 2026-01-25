import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { 게시판 boardsApi, 게시판 조회Response } from "./api";
import { QueryKeys } from "../queryKeys";

const useGet게시판 조회 = (boardCode: string | number, params?: Record<string, any>) => {
  return useQuery<게시판 조회Response, AxiosError>({
    queryKey: [QueryKeys['게시판- boards'].게시판 조회, boardCode, params],
    queryFn: () => 게시판 boardsApi.get게시판 조회({ boardCode, params }),
    enabled: !!boardCode,
  });
};

export default useGet게시판 조회;