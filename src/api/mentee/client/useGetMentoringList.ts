import { axiosInstance } from "@/utils/axiosInstance";

import { queryKey } from "./queryKey";

import { MentoringListItem } from "@/types/mentee";
import { VerifyStatus } from "@/types/mentee";

import { useQuery } from "@tanstack/react-query";

interface UseGetMenteeMentoringListResponse {
  content: MentoringListItem[];
  nextPageNumber: number;
}
type UseGetMenteeMentoringListRequest = VerifyStatus;

const getMenteeMentoringList = async (
  verifyStatus: UseGetMenteeMentoringListRequest,
): Promise<UseGetMenteeMentoringListResponse> => {
  const res = await axiosInstance.get<UseGetMenteeMentoringListResponse>(
    `/mentee/mentorings?verify-status=${verifyStatus}`,
  );
  return res.data;
};

const useGetMenteeMentoringList = (verifyStatus: UseGetMenteeMentoringListRequest) => {
  return useQuery({
    queryKey: [queryKey.menteeMentoringList, verifyStatus],
    queryFn: () => getMenteeMentoringList(verifyStatus),
    staleTime: 1000 * 60 * 5, // 5분간 캐시
    select: (data) => data.content,
  });
};
export default useGetMenteeMentoringList;
