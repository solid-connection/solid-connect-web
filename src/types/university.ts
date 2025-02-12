export type RegionKo = "아시아권" | "미주권" | "유럽권" | "중국권";

export type Country = string;

export interface LanguageRequirement {
  languageTestType: string; // 어학 시험 종류
  minScore: string; // 최소 점수
}

export interface University {
  id: number;
  term: string; // 파견 연도와 학기 ex) "2022-1"
  koreanName: string;
  englishName: string;
  formatName: string;
  region: string;
  country: string;
  homepageUrl: string;
  logoImageUrl: string;
  backgroundImageUrl: string;
  detailsForLocal: string; // 지역 정보

  studentCapacity: number;
  tuitionFeeType: string; // 등록금 납부 유형
  semesterAvailableForDispatch: string; // 파견 가능 학기

  languageRequirements: LanguageRequirement[];
  detailsForLanguage: string; // 어학 세부 요건
  gpaRequirement: string; // 최저 성적 요건 - 최저 성적
  gpaRequirementCriteria: string; // 최저 성적 요건 - 기준
  semesterRequirement: string; // 최저 이수 학기

  detailsForApply: string; // 지원 자격 요건 - 기타
  detailsForMajor: string; // 지원 전공 관련
  detailsForAccommodation: string; // 기숙사 中 텍스트
  accommodationUrl: string; // 기숙사 中 링크
  detailsForEnglishCourse: string; // // 영어 강의 리스트 中 텍스트
  englishCourseUrl: string; // 영어 강의 리스트 中 링크
  details: string; // 비고
}

export interface ListUniversity {
  id: number;
  term: string;
  koreanName: string;
  region: string;
  country: string;
  logoImageUrl: string;
  backgroundImageUrl: string;
  studentCapacity: number;
  languageRequirements: LanguageRequirement[];
}

export interface UniversityFavoriteStatusResponse {
  isLike: boolean;
}

export interface UniversityFavoriteResponse {
  result: "LIKE_SUCCESS" | "LIKE_CANCELED";
}

export interface RecommendedUniversitiesResponse {
  recommendedUniversities: ListUniversity[];
}
