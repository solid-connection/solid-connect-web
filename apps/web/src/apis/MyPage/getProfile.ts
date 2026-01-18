import { AxiosError } from "axios";

import { QueryKeys } from "../queryKeys";
import { MyInfoResponse, myPageApi } from "./api";

import { UseQueryResult, useMutationState, useQuery } from "@tanstack/react-query";

type UseGetMyInfoResult = Omit<UseQueryResult<MyInfoResponse, AxiosError>, "data"> & {
  data: MyInfoResponse | undefined;
};

const useGetMyInfo = (): UseGetMyInfoResult => {
  const queryResult = useQuery<MyInfoResponse, AxiosError>({
    queryKey: [QueryKeys.MyPage.profile],
    queryFn: () => myPageApi.getProfile(),
    // staleTime을 무한으로 설정하여 불필요한 자동 refetch를 방지합니다.
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30, // 예: 30분
  });

  const pendingMutations = useMutationState({
    filters: {
      mutationKey: [QueryKeys.MyPage.profile, "patch"],
      status: "pending",
    },
    select: (mutation) => {
      return mutation.state.variables as Partial<MyInfoResponse>;
    },
  });

  const isOptimistic = pendingMutations.length > 0;
  const pendingData = isOptimistic ? pendingMutations[0] : null;

  const displayData = isOptimistic && queryResult.data ? { ...queryResult.data, ...pendingData } : queryResult.data;

  return { ...queryResult, data: displayData as MyInfoResponse | undefined };
};

export default useGetMyInfo;
