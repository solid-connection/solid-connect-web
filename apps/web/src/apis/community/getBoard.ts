import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { QueryKeys } from "../queryKeys";
import { type BoardResponse, communityApi } from "./api";

const useGetBoard = (boardCode: string | number, params?: Record<string, any>) => {
  return useQuery<BoardResponse, AxiosError>({
    queryKey: [QueryKeys.community.board, boardCode, params],
    queryFn: () => communityApi.getBoard(boardCode as string, params),
    enabled: !!boardCode,
  });
};

export default useGetBoard;
