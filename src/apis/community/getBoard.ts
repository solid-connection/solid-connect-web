import { AxiosError } from "axios";

import { QueryKeys } from "../queryKeys";
import { BoardResponse, communityApi } from "./api";

import { useQuery } from "@tanstack/react-query";

const useGetBoard = (boardCode: string | number, params?: Record<string, any>) => {
  return useQuery<BoardResponse, AxiosError>({
    queryKey: [QueryKeys.community.board, boardCode, params],
    queryFn: () => communityApi.getBoard(boardCode as string, params),
    enabled: !!boardCode,
  });
};

export default useGetBoard;
