import serverFetch from "@/utils/serverFetchUtil";

import { University } from "@/types/university";

export const getUniversityDetail = async (universityInfoForApplyId: number): Promise<University | undefined> => {
  const result = await serverFetch<University>(`/univ-apply-infos/${universityInfoForApplyId}`);

  if (!result.ok) {
    throw new Error(`Failed to fetch university detail for id ${universityInfoForApplyId}: ${result.error}`);
  }

  return result.data;
};
