import type { University } from "@/types/university";
import serverFetch from "@/utils/serverFetchUtil";

type UniversityDetailFetchSuccess = {
  ok: true;
  status: number;
  data: University;
};

type UniversityDetailFetchFailure = {
  ok: false;
  status: number;
  error: string;
};

export type UniversityDetailFetchResult = UniversityDetailFetchSuccess | UniversityDetailFetchFailure;

export const getUniversityDetailWithStatus = async (
  universityInfoForApplyId: number,
): Promise<UniversityDetailFetchResult> => {
  const result = await serverFetch<University>(`/univ-apply-infos/${universityInfoForApplyId}`);

  if (!result.ok) {
    console.error(`Failed to fetch university detail (ID: ${universityInfoForApplyId}):`, result.error);
    return {
      ok: false,
      status: result.status,
      error: result.error,
    };
  }

  return {
    ok: true,
    status: result.status,
    data: result.data,
  };
};

export const getUniversityDetail = async (universityInfoForApplyId: number): Promise<University | undefined> => {
  const result = await getUniversityDetailWithStatus(universityInfoForApplyId);
  return result.ok ? result.data : undefined;
};
