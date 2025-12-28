import { AxiosError } from "axios";
import { useMutationState, useQuery } from "@tanstack/react-query";
import { myPageApi, MyInfoResponse } from "./api";
import { QueryKeys } from "../queryKeys";

const useGetMyInfo = () => {
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

  const displayData = isOptimistic ? { ...queryResult.data, ...pendingData } : queryResult.data;

  return { ...queryResult, data: displayData };
};

export default useGetMyInfo;