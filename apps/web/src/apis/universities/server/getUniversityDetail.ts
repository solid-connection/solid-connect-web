import type { University } from "@/types/university";
import serverFetch from "@/utils/serverFetchUtil";

export const getUniversityDetail = async (universityInfoForApplyId: number): Promise<University | undefined> => {
  const result = await serverFetch<University>(`/univ-apply-infos/${universityInfoForApplyId}`);

  if (!result.ok) {
    console.error(`Failed to fetch university detail (ID: ${universityInfoForApplyId}):`, result.error);
    return undefined;
  }

  return result.data;
};
