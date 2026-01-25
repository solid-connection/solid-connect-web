import type { University } from "@/types/university";
import serverFetch from "@/utils/serverFetchUtil";

export const getUniversityDetail = async (universityInfoForApplyId: number): Promise<University | undefined> => {
  const result = await serverFetch<University>(`/univ-apply-infos/${universityInfoForApplyId}`);

  return result.data;
};
