import { AxiosError } from "axios";

import { QueryKeys } from "../queryKeys";
import { BoardListResponse, communityApi } from "./api";

import { useQuery } from "@tanstack/react-query";

const useGetBoardList = (params?: Record<string, any>) => {
  return useQuery<BoardListResponse, AxiosError>({
    queryKey: [QueryKeys.community.boardList, params],
    queryFn: () => communityApi.getBoardList(params ? { params } : {}),
  });
};

export default useGetBoardList;
