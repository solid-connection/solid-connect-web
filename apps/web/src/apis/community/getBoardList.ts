import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { communityApi, BoardListResponse } from "./api";
import { QueryKeys } from "../queryKeys";

const useGetBoardList = (params?: Record<string, any>) => {
  return useQuery<BoardListResponse, AxiosError>({
    queryKey: [QueryKeys.community.boardList, params],
    queryFn: () => communityApi.getBoardList(params ? { params } : {}),
  });
};

export default useGetBoardList;