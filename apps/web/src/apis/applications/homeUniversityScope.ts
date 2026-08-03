import type { ApplicationListResponse, ScoreSheet } from "@/types/application";

/**
 * 지원자 현황 응답을 소속 대학 기준으로 걸러내기 위한 키.
 *
 * `GET /applications` 응답(ScoreSheet)에는 홈 대학 식별자도, 지원 정보 id 도 없다.
 * 그래서 파견학교 목록과 겹치는 필드(파견학교명 + 국가 + 모집인원)를 합쳐 식별한다.
 *
 * 파견학교명만으로는 부족하다. 서로 다른 홈 대학이 같은 이름의 파견학교를 가질 수 있고
 * (예: 경희대·중앙대 모두 보유한 국립정치대학교), 그 경우 이름만으로는 구분되지 않는다.
 */
type ScopeKeySource = {
  koreanName: string;
  country: string;
  studentCapacity: number | null;
};

export const createHomeUniversityScopeKey = ({ koreanName, country, studentCapacity }: ScopeKeySource): string =>
  `${koreanName}|${country}|${studentCapacity ?? ""}`;

/**
 * 소속 대학의 파견학교 목록에 포함된 항목만 남긴다.
 * 기준 목록이 비어 있으면 필터링하지 않고 원본을 그대로 돌려준다.
 */
export const filterApplicationsByHomeUniversityScope = (
  applications: ApplicationListResponse,
  scopedUniversities: ScopeKeySource[] | undefined,
): ApplicationListResponse => {
  if (!scopedUniversities || scopedUniversities.length === 0) {
    return applications;
  }

  const allowedKeys = new Set(scopedUniversities.map(createHomeUniversityScopeKey));

  return {
    choices: applications.choices.map((scoreSheets: ScoreSheet[]) =>
      scoreSheets.filter((scoreSheet) => allowedKeys.has(createHomeUniversityScopeKey(scoreSheet))),
    ),
  };
};
