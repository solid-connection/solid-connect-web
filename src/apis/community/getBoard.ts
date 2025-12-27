import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { communityApi, BoardResponse } from "./api";
import { QueryKeys } from "../queryKeys";

const useGetBoard = (boardCode: string | number, params?: Record<string, any>) => {
  return useQuery<BoardResponse, AxiosError>({
    queryKey: [QueryKeys.community.board, boardCode, params],
    queryFn: () => communityApi.getBoard({ boardCode, params }),
    enabled: !!boardCode,
  });
};

export default useGetBoard;