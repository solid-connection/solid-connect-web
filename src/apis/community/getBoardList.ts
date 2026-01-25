import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { QueryKeys } from "../queryKeys";
import { type BoardListResponse, communityApi } from "./api";

const useGetBoardList = (params?: Record<string, any>) => {
  return useQuery<BoardListResponse, AxiosError>({
    queryKey: [QueryKeys.community.boardList, params],
    queryFn: () => communityApi.getBoardList(params ? { params } : {}),
  });
};

export default useGetBoardList;
