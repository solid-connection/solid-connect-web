export const REGIONS = ["아시아권", "미주권", "유럽권", "중국권"];
export type Region = "아시아권" | "미주권" | "유럽권" | "중국권";

export const COUNTRIES = [
  // 2024-2 기준
  // 아시아권
  "말레이시아",
  "브루나이",
  "싱가포르",
  "아제르바이잔",
  "인도네시아",
  "일본",
  "키르기스스탄",
  "튀르키예",
  "홍콩",
  // 미주권
  "미국",
  "캐나다",
  "호주",
  "브라질",
  // 유럽권
  "네덜란드",
  "노르웨이",
  "덴마크",
  "독일",
  "리투아니아",
  "리히텐슈타인",
  "스웨덴",
  "스위스",
  "스페인",
  "오스트리아",
  "체코",
  "포르투갈",
  "폴란드",
  "프랑스",
  "핀란드",
  // 중국권
  "중국",
  "대만",
];
export type Country = (typeof COUNTRIES)[number];

export interface College {
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

export interface CollegePersonal extends College {
  liked: boolean;
}

export interface ListCollege {
  id: number;
  term: string;
  koreanName: string;
  region: string;
  country: string;
  logoImageUrl: string;
  studentCapacity: number;
  languageRequirements: LanguageRequirement[];
}

export interface SimpleCollege {
  id: number;
  koreanName: string;
  backgroundImgUrl: string;
}

export interface LanguageRequirement {
  languageTestType: string; // 어학 시험 종류
  minScore: string; // 최소 점수
}

export interface CardCollege {
  id: number;
  koreanName: string;
  backgroundImgUrl: string;
}
